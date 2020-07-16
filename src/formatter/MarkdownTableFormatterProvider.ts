import * as vscode from 'vscode';
import { getExtensionTables, setExtensionTables } from '../extension';
import { MarkdownTable } from '../MarkdownTable';
import { checkLanguage, discoverMaxColumnSizes, discoverMaxTableSizes, padding, swidth, tablesIn } from '../MarkdownTableUtils';
import { Reporter } from '../telemetry/Reporter';
import MarkdownTableFormatterSettings, { MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes } from './MarkdownTableFormatterSettings';
import MarkdownTableFormatterSettingsImpl from './MarkdownTableFormatterSettingsImpl';
import { addTailPipes, fixJustification, joinCells, tableJustification } from './MarkdownTableFormatterUtils';

export class MarkdownTableFormatterProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider, vscode.Disposable {

	private disposables: vscode.Disposable[] = [];

	private config: MarkdownTableFormatterSettings

	private reporter?: Reporter

	constructor(config: MarkdownTableFormatterSettings, reporter?: Reporter) {
		this.reporter = reporter;
		this.config = config;
	}

	dispose(): void {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register(): void {
		this.config = MarkdownTableFormatterSettingsImpl.shared;
		if (this.config.enable) {
			this.config.markdownGrammarScopes.forEach((scope) => {
				this.registerFormatterForScope(scope);
			})

			this.disposables.push(vscode.workspace.onDidOpenTextDocument(document => {
				if (!checkLanguage(document.languageId, this.config)) { return }
				const fullDocumentRange = new vscode.Range(0, 0, document.lineCount + 1, 0);
				setExtensionTables(tablesIn(document, fullDocumentRange));
			}));

			this.disposables.push(vscode.workspace.onDidChangeTextDocument(change => {
				if (!checkLanguage(change.document.languageId, this.config)) { return }
				const fullDocumentRange = new vscode.Range(0, 0, change.document.lineCount + 1, 0);
				setExtensionTables(tablesIn(change.document, fullDocumentRange));
			}));

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

		table.body.forEach((_, i) => {
			const body = table.body[i][rightIndex];
			table.body[i][rightIndex] = table.body[i][leftIndex];
			table.body[i][leftIndex] = body;
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

	private formatDocument(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
		const config = MarkdownTableFormatterSettingsImpl.shared;
		const edits: vscode.TextEdit[] = [];
		// This check is in case some grammar is removed and VSCode is not reloaded yet
		if (!checkLanguage(document.languageId, this.config)) {
			vscode.window.showWarningMessage(`Markdown table formatter is not enabled for '${document.languageId}' language!`);
			return edits;
		}
		const tables: MarkdownTable[] = setExtensionTables(tablesIn(document, range));

		if (config.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameColumnSize) {
			const maxSize = discoverMaxColumnSizes(tables);
			tables.forEach(table => {
				table.columnSizes = maxSize;
			});
		} if (config.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameTableSize) {
			const tableSizes = discoverMaxTableSizes(tables, config.spacePadding);
			tables.forEach((table, i) => {
				table.columnSizes = tableSizes[i];
			});
		}
		tables.forEach(table => {
			edits.push(new vscode.TextEdit(table.range, this.formatTable(table, config)));
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
		length = Math.max(length - swidth(text), 0);
		let justifySwitch = fixJustification(justification);
		if (justifySwitch === "--") {
			justifySwitch = tableJustification[settings.defaultTableJustification];
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

	public formatTable(table: MarkdownTable, settings: MarkdownTableFormatterSettings): string {
		const startDate = new Date().getTime();
		table.body.forEach((line, i) => {
			if (table.header.length !== line.length) {
				vscode.window.showErrorMessage(`Table at line ${table.startLine + 1} has a line with different column number as the header. | Header columns: ${table.header.length} | Body line ${table.startLine + i + 3} columns: ${line.length}`)
			}
		});

		const addTailPipesIfNeeded = settings.keepFirstAndLastPipes
			? addTailPipes
			: (x: string) => x;

		let header: string[] = [];
		if (table.header) {
			header = this.formatLines([table.header], table.format, table.columnSizes, settings).map(line => {
				const cellPadding = padding(settings.spacePadding);
				return line.map((cell) => {
					return `${cellPadding}${cell}${cellPadding}`;
				});
			}).map(joinCells).map(addTailPipesIfNeeded);
		}

		const formatLine = this.formatLines([table.format], table.format, table.columnSizes, settings).map(line => {
			return line.map((cell, i) => {
				let line = "";
				let [front, back] = fixJustification(cell);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(cell) === tableJustification[settings.defaultTableJustification])) {
					front = back = '-';
				}

				const spacePadding = padding(settings.spacePadding, ' ');
				switch (settings.delimiterRowPadding) {
					case MarkdownTableFormatterDelimiterRowPadding.None:
						line = front + padding(table.columnSizes[i] + (settings.spacePadding * 2) - 2, '-') + back;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.FollowSpacePadding:
						line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2, '-')}${table.columnSizes[i] === 1 ? '' : back}${spacePadding}`;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.SingleApaceAlways:
						line = ` ${front}${padding(table.columnSizes[i] + (settings.spacePadding * 2) - 4, '-')}${back} `;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.AlignmentMarker: {
						let justifySwitch = fixJustification(cell);
						if (justifySwitch === "--") {
							justifySwitch = tableJustification[settings.defaultTableJustification];
						}
						switch (justifySwitch) {
							case '::':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2, '-')}${back}${spacePadding}`;
								break;
							case '-:':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2 + settings.spacePadding, '-')}${back}`;
								break;
							case ':-':
								line = `${front}${padding(table.columnSizes[i] - 2 + settings.spacePadding, '-')}${back}${spacePadding}`;
								break;
						}
						break;
					}
				}

				return line;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		const body = this.formatLines(table.body, table.format, table.columnSizes, settings).map(line => {
			const cellPadding = padding(settings.spacePadding);
			return line.map((cell) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatted = [formatLine, ...body];
		if (table.header) {
			formatted = [header, formatLine, ...body];
		}
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("function", {
			name: "formatTable",
			tableId: table.id,
			settings: settings.toString()
		}, {
			timeTakenMilliseconds: endDate - startDate,
			table_lineCount: table.totalLines
		});
		return formatted.join('\n');
	}

	// vscode.Commands
	// vscode.Commands
	private moveColumnRightCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		const startDate = new Date().getTime();
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		const tables = getExtensionTables(editor.selection);
		const header = this.getColumnIndexFromRange(tables[0], editor.selection);
		if (header < 0) {
			return;
		}
		const leftHeaderIndex = header;
		if ((leftHeaderIndex + 1) >= tables[0].columns) {
			return;
		}
		const rightHeaderIndex = header + 1;
		const table = this.flipColumn(tables[0], leftHeaderIndex, rightHeaderIndex);
		edit.replace(table.range, table.notFormatted());
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("command", {
			name: "moveColumnRightCommand",
		}, {
			timeTakenMilliseconds: endDate - startDate
		});
	}

	// vscode.Commands
	private moveColumnLeftCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		const startDate = new Date().getTime();
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		const tables = getExtensionTables(editor.selection);
		const header = this.getColumnIndexFromRange(tables[0], editor.selection);
		if (header < 0) {
			return;
		}
		const leftHeaderIndex = header - 1;
		if (leftHeaderIndex < 0) {
			return;
		}
		const rightHeaderIndex = header;
		const table = this.flipColumn(tables[0], leftHeaderIndex, rightHeaderIndex);
		edit.replace(table.range, table.notFormatted());
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("command", {
			name: "moveColumnLeftCommand",
		}, {
			timeTakenMilliseconds: endDate - startDate
		});
	}

	// vscode.DocumentFormattingEditProvider implementation
	provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.ProviderResult<vscode.TextEdit[]> {
		const startDate = new Date().getTime();
		const fullDocumentRange = new vscode.Range(0, 0, document.lineCount + 1, 0);
		const edits = this.formatDocument(document, fullDocumentRange);
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("formatter", {
			type: "full",
		}, {
			timeTakenMilliseconds: endDate - startDate,
			file_lineCount: document.lineCount
		});
		return edits;
	}

	// vscode.DocumentRangeFormattingEditProvider implementation
	provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.ProviderResult<vscode.TextEdit[]> {
		const startDate = new Date().getTime();
		const edits = this.formatDocument(document, range);
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("formatter", {
			type: "range"
		}, {
			timeTakenMilliseconds: endDate - startDate,
			range_lineCount: range.end.line - range.start.line
		});
		return edits;
	}
}
