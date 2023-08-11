import * as vscode from 'vscode';
import {MarkdownTable} from '../MarkdownTable';
import {checkLanguage, discoverMaxColumnSizes, discoverMaxTableSizes, padding, stringWidth, tablesIn} from '../MarkdownTableUtils';
import {MarkdownTableSortDirection} from '../sorter/MarkdownTableSortDirection';
import {getActiveSort, setActiveSort} from '../sorter/MarkdownTableSortUtils';
import MarkdownTableFormatterSettings, {MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes} from './MarkdownTableFormatterSettings';
import MarkdownTableFormatterSettingsImpl from './MarkdownTableFormatterSettingsImpl';
import {addTailPipes, fixJustification, joinCells, tableJustification} from './MarkdownTableFormatterUtils';

export class MarkdownTableFormatterProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider, vscode.Disposable {

	private disposables: vscode.Disposable[] = [];

	private config: MarkdownTableFormatterSettings

	constructor(config: MarkdownTableFormatterSettings) {
		this.config = config;
	}

	dispose(): void {
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
	}

	public setConfig(config: MarkdownTableFormatterSettings): void {
		this.config = config
	}

	public register(): void {
		if (!this.config) {
			this.config = MarkdownTableFormatterSettingsImpl.shared;
		}
		if (this.config.enable) {
			this.config.markdownGrammarScopes?.forEach((scope) => {
				this.registerFormatterForScope(scope);
			})

			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", this.enableForCurrentScopeCommand, this));
			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnRight", this.moveColumnRightCommand, this));
			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnLeft", this.moveColumnLeftCommand, this));
		}
	}

	private flipColumn(table: MarkdownTable, leftIndex: number, rightIndex: number): MarkdownTable {
		if (table.header) {
			const header = table.header[rightIndex];
			table.header[rightIndex] = table.header[leftIndex];
			table.header[leftIndex] = header;
		}

		const format = table.format[rightIndex];
		table.format[rightIndex] = table.format[leftIndex];
		table.format[leftIndex] = format;

		table.body?.forEach((_, i) => {
			const body = table.body![i][rightIndex];
			table.body![i][rightIndex] = table.body![i][leftIndex];
			table.body![i][leftIndex] = body;
		});
		return table;
	}

	private getColumnIndexFromRange(table: MarkdownTable, range: vscode.Range): number {
		let response = -1;
		table.ranges.forEach((rangeList, columnIndex) => {
			rangeList.forEach(rangeItem => {
				if (rangeItem.contains(range)) {
					response = columnIndex;
				}
			});
		});
		return response;
	}

	/**
	 * Extract `edits` from the `range` of the `document` to format the tables
	 * @param document Document to format
	 * @param range Range of the document do format
	 * @returns `TextEdit[]` of edits ({@link vscode.TextEdit})
	 */
	public formatDocument(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
		const edits: vscode.TextEdit[] = [];
		// This check is in case some grammar is removed and VSCode is not reloaded yet
		if (!checkLanguage(document.languageId, this.config)) {
			vscode.window.showWarningMessage(`Markdown table formatter is not enabled for '${document.languageId}' language!`);
			return edits;
		}
		let tables: MarkdownTable[] = tablesIn(document, range);

		tables = tables.filter(table => this.checkColumnsPerLine(table))

		// Fix sizes of empty row tables
		tables.forEach(table => {
			if (table.body) {
				table.body?.forEach((line, i) => {
					if (table.header.length !== line.length) {
						if (this.config.allowEmptyRows) {
							if (table.header.length > line.length) {
								const lineFixed = line.concat(Array(table.header.length - line.length).fill(""))
								table.body![i] = lineFixed
							} else if (line.length > table.header.length) {
								const lineFixed = line.slice(0, table.header.length)
								table.body![i] = lineFixed
							}
						}
					}
				});
			}
			if (table.header.length !== table.format.length) {
				if (this.config.allowEmptyRows) {
					table.format = table.format.concat(Array(table.header.length - table.format.length).fill("-"))
				}
			}

			table.updateSizes();
		});

		if (this.config.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameColumnSize) {
			if (tables.length > 0) {
				const maxSize = discoverMaxColumnSizes(tables);
				tables.forEach(table => {
					table.columnSizes = maxSize;
				});
			}
		}
		if (this.config.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameTableSize) {
			const tableSizes = discoverMaxTableSizes(tables, this.config.spacePadding!);
			tables.forEach((table, i) => {
				table.columnSizes = tableSizes[i];
			});
		}
		tables.forEach(table => {
			edits.push(vscode.TextEdit.replace(table.range, this.formatTable(table, this.config)));
		});
		return edits;
	}

	private registerFormatterForScope(scope: vscode.DocumentSelector) {
		this.disposables.push(vscode.languages.registerDocumentFormattingEditProvider(scope, this));
		this.disposables.push(vscode.languages.registerDocumentRangeFormattingEditProvider(scope, this));
	}

	private formatLine(line: string[], format: string[], size: number[], settings: MarkdownTableFormatterSettings) {
		line = line.map((column, index) => {
			const columnSize = size[index];
			const columnJustification = format[index];
			const text = this.justify(column, columnJustification, columnSize, settings);
			return text;
		});
		return line;
	}

	private formatLines(lines: string[][], format: string[], size: number[], settings: MarkdownTableFormatterSettings) {
		lines = lines.map(line => {
			return this.formatLine(line, format, size, settings);
		});
		return lines;
	}

	private justify(text: string, justification: string, length: number, settings: MarkdownTableFormatterSettings) {
		text = text.trim();
		length = Math.max(length - stringWidth(text), 0);
		let justifySwitch = fixJustification(justification);
		if (justifySwitch === "--") {
			justifySwitch = tableJustification[settings.defaultTableJustification!];
		}
		switch (justifySwitch) {
			case '::':
				return padding(length / 2) + text + padding((length + 1) / 2);
			case '-:':
				return padding(length) + text;
			case ':-':
				return text + padding(length);
			default:
				throw new Error(`Unknown column justification ${justifySwitch}`);
		}
	}

	private formatTable(table: MarkdownTable, settings: MarkdownTableFormatterSettings): string {
		const startDate = new Date().getTime();

		const addTailPipesIfNeeded = settings.keepFirstAndLastPipes
			? addTailPipes
			: (x: string) => x;

		const header = this.formatLines([table.header], table.format, table.columnSizes, settings).map(line => {
			const cellPadding = padding(settings.spacePadding!);
			return line.map((cell) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);


		const formatLine = this.formatLines([table.format], table.format, table.columnSizes, settings).map(line => {
			return line.map((cell, i) => {
				let line = "";
				let [front, back] = fixJustification(cell);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(cell) === tableJustification[settings.defaultTableJustification!])) {
					front = back = '-';
				}

				const spacePadding = padding(settings.spacePadding!, ' ');
				switch (settings.delimiterRowPadding) {
					case MarkdownTableFormatterDelimiterRowPadding.None:
						line = front + padding(table.columnSizes[i] + (settings.spacePadding! * 2) - 2, '-') + back;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.FollowSpacePadding:
						line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2, '-')}${table.columnSizes[i] === 1 ? '' : back}${spacePadding}`;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.SingleApaceAlways:
						line = ` ${front}${padding(table.columnSizes[i] + (settings.spacePadding! * 2) - 4, '-')}${back} `;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.AlignmentMarker: {
						let justifySwitch = fixJustification(cell);
						if (justifySwitch === "--") {
							justifySwitch = tableJustification[settings.defaultTableJustification!];
						}
						switch (justifySwitch) {
							case '::':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2, '-')}${back}${spacePadding}`;
								break;
							case '-:':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2 + settings.spacePadding!, '-')}${back}`;
								break;
							case ':-':
								line = `${front}${padding(table.columnSizes[i] - 2 + settings.spacePadding!, '-')}${back}${spacePadding}`;
								break;
						}
						break;
					}
				}

				return line;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		const body = this.formatLines(table.body || [[]], table.format, table.columnSizes, settings).map(line => {
			const cellPadding = padding(settings.spacePadding!);
			return line.map((cell) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		const formatted = [header, formatLine, ...body]

		const endDate = new Date().getTime();

		if (table.isInList) {
			for (let index = 0; index < formatted.length; index++) {
				formatted[index] = table.listIndentation[index] + formatted[index]
			}
		}

		return formatted.join('\n');
	}

	private checkColumnsPerLine(table: MarkdownTable): boolean {
		if (table.header.length !== table.format.length) {
			vscode.window.showErrorMessage(`Table at line ${table.startLine + 1} has a line with different column number as the header.`, // - Header columns: ${table.header.length} - Format line columns: ${table.format.length}`,
				"Focus"
			).then(choice => {
				if (choice === "Focus") {
					vscode.window.activeTextEditor?.revealRange(table.range)
					const s = new vscode.Selection(table.startLine + 1, 0, table.startLine + 2, 0)
					vscode.window.activeTextEditor!.selection = s
				}
			})
			return false
		}
		return true
	}

	// vscode.Commands
	private moveColumnRightCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		const startDate = new Date().getTime();
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		const tables = tablesIn(editor.document)
		const tableSelected = tables.find(t => {
			return t.range.contains(editor.selection);
		})
		if (!tableSelected) { return }

		const header = this.getColumnIndexFromRange(tableSelected, editor.selection);
		if (header < 0) {
			return;
		}
		const leftHeaderIndex = header;
		if ((leftHeaderIndex + 1) >= tableSelected.columns) {
			return;
		}
		const rightHeaderIndex = header + 1;
		const table = this.flipColumn(tableSelected, leftHeaderIndex, rightHeaderIndex);

		const active_sort = getActiveSort(editor.document, table.id)
		const sort_direction = active_sort?.sort_direction ? active_sort?.sort_direction : MarkdownTableSortDirection.None
		setActiveSort(editor.document, table.id, active_sort?.header_index === header ? rightHeaderIndex : leftHeaderIndex, sort_direction)

		edit.replace(table.range, table.notFormatted());
		const endDate = new Date().getTime();
	}

	// vscode.Commands
	private enableForCurrentScopeCommand = (editor: vscode.TextEditor) => {
		const scopes = this.config.markdownGrammarScopes;
		if (!scopes?.includes(editor.document.languageId)) {
			scopes?.push(editor.document.languageId);
			vscode.workspace.getConfiguration('markdown-table-formatter').update("markdownGrammarScopes", scopes, true);
			this.registerFormatterForScope(editor.document.languageId);
			vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
		}
	}

	private moveColumnLeftCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		const tables = tablesIn(editor.document)
		const tableSelected = tables.find(t => {
			return t.range.contains(editor.selection);
		})
		if (!tableSelected) { return }

		const header = this.getColumnIndexFromRange(tableSelected, editor.selection);
		if (header < 0) {
			return;
		}
		const leftHeaderIndex = header - 1;
		if (leftHeaderIndex < 0) {
			return;
		}
		const rightHeaderIndex = header;
		const table = this.flipColumn(tableSelected, leftHeaderIndex, rightHeaderIndex);

		const active_sort = getActiveSort(editor.document, table.id)
		const sort_direction = active_sort?.sort_direction ? active_sort?.sort_direction : MarkdownTableSortDirection.None
		setActiveSort(editor.document, table.id, active_sort?.header_index === header ? leftHeaderIndex : rightHeaderIndex, sort_direction)

		edit.replace(table.range, table.notFormatted());
	}

	// vscode.DocumentFormattingEditProvider implementation
	provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<vscode.TextEdit[]> {
		const fullDocumentRange = new vscode.Range(0, 0, document.lineCount + 1, 0);
		const edits = this.formatDocument(document, fullDocumentRange);
		return edits;
	}

	// vscode.DocumentRangeFormattingEditProvider implementation
	provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<vscode.TextEdit[]> {
		const edits = this.formatDocument(document, range);
		return edits;
	}
}
