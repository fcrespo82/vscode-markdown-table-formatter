import * as vscode from 'vscode';
import { getExtensionTables, setExtensionTables } from '../extension';
import { addTailPipes, fixJustification, joinCells, tableJustification } from './MarkdownTableFormatterUtils';
import { MarkdownTable } from '../MarkdownTable';
import MarkdownTableFormatterSettings from './MarkdownTableFormatterSettings';
import { discoverMaxColumnSizes, discoverMaxTableSizes, getSettings, padding, swidth, tablesIn } from '../MarkdownTableUtils';
import { MarkdownTableFormatterGlobalColumnSizes } from './MarkdownTableFormatterGlobalColumnSizes';
import { MarkdownTableFormatterDelimiterRowPadding } from './MarkdownTableFormatterDelimiterRowPadding';

export class MarkdownTableFormatterProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {

	public disposables: vscode.Disposable[] = [];
	private config: vscode.WorkspaceConfiguration;

	constructor() {
		this.config = vscode.workspace.getConfiguration('markdown-table-formatter');
	}

	dispose() {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register() {
		if (this.config.get<boolean>("enable", true)) {
			const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
			scopes.forEach(scope => {
				this.registerFormatterForScope(scope);
			});
			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", this.enableForCurrentScopeCommand, this));

			vscode.workspace.onDidOpenTextDocument(document => {
				let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
				setExtensionTables(tablesIn(document, fullDocumentRange));
			});

			vscode.workspace.onDidChangeTextDocument(change => {
				let fullDocumentRange = change.document.validateRange(new vscode.Range(0, 0, change.document.lineCount + 1, 0));
				setExtensionTables(tablesIn(change.document, fullDocumentRange));
			});

			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnRight", this.moveColumnRightCommand, this));
			this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnLeft", this.moveColumnLeftCommand, this));

		}
	}

	private flipColumn(table: MarkdownTable, leftIndex: number, rightIndex: number): MarkdownTable {
		if (table.header) {
			let header = table.header[rightIndex];
			table.header[rightIndex] = table.header[leftIndex];
			table.header[leftIndex] = header;
		}

		let format = table.format[rightIndex];
		table.format[rightIndex] = table.format[leftIndex];
		table.format[leftIndex] = format;

		table.body.forEach((_, i) => {
			let body = table.body[i][rightIndex];
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
		let edits: vscode.TextEdit[] = [];
		// This check is in case some grammar is removed and VSCode is not reloaded yet
		if (!getSettings().markdownGrammarScopes.includes(document.languageId)) {
			vscode.window.showWarningMessage(`Markdown table formatter is not enabled for '${document.languageId}' language!`);
			return edits;
		}
		let tables: MarkdownTable[] = setExtensionTables(tablesIn(document, range));

		if (getSettings().globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameColumnSize) {
			let maxSize = discoverMaxColumnSizes(tables);
			tables.forEach(table => {
				table.columnSizes = maxSize;
			});
		} if (getSettings().globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameTableSize) {
			let tableSizes = discoverMaxTableSizes(tables, getSettings().spacePadding);
			tables.forEach((table, i) => {
				table.columnSizes = tableSizes[i];
			});
		}
		tables.forEach(table => {
			edits.push(new vscode.TextEdit(table.range, this.formatTable(table, getSettings())));
		});
		return edits;
	}



	private registerFormatterForScope(scope: vscode.DocumentSelector) {
		this.disposables.push(vscode.languages.registerDocumentFormattingEditProvider(scope, this));
		this.disposables.push(vscode.languages.registerDocumentRangeFormattingEditProvider(scope, this));
	}

	private formatLine(line: string[], format: string[], size: number[], settings: MarkdownTableFormatterSettings) {
		line = line.map((column, index, _) => {
			let columnSize = size[index];
			let columnJustification = format[index];
			let text = this.justify(column, columnJustification, columnSize, settings);
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

	public formatTable(table: MarkdownTable, settings: MarkdownTableFormatterSettings) {
		let addTailPipesIfNeeded = settings.keepFirstAndLastPipes
			? addTailPipes
			: (x: string) => x;

		let header: string[] = [];
		if (table.header) {
			header = this.formatLines([table.header], table.format, table.columnSizes, settings).map(line => {
				let cellPadding = padding(settings.spacePadding);
				return line.map((cell, i) => {
					return `${cellPadding}${cell}${cellPadding}`;
				});
			}).map(joinCells).map(addTailPipesIfNeeded);
		}

		let formatLine = this.formatLines([table.format], table.format, table.columnSizes, settings).map(line => {
			return line.map((cell, i) => {
				let line: string = "";
				let [front, back] = fixJustification(cell);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(cell) === tableJustification[settings.defaultTableJustification])) {
					front = back = '-';
				}

				let spacePadding = padding(settings.spacePadding, ' ');
				switch (settings.delimiterRowPadding) {
					case MarkdownTableFormatterDelimiterRowPadding.None:
						line = front + padding(table.columnSizes[i] + (settings.spacePadding * 2) - 2, '-') + back;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.FollowSpacePadding:
						line = `${spacePadding}${front}${padding(table.columnSizes[i] - 2, '-')}${back}${spacePadding}`;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.SingleApaceAlways:
						line = ` ${front}${padding(table.columnSizes[i] + (settings.spacePadding * 2) - 4, '-')}${back} `;
						break;
					case MarkdownTableFormatterDelimiterRowPadding.AlignmentMarker:
						let justifySwitch = fixJustification(cell);
						if (justifySwitch === "--") {
							justifySwitch = tableJustification[settings.defaultTableJustification];
						}
						switch (justifySwitch) {
							case '::':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] + (settings.spacePadding * 2) - 4, '-')}${back}${spacePadding}`;
								break;
							case '-:':
								line = `${spacePadding}${front}${padding(table.columnSizes[i] + (settings.spacePadding * 2) - 3, '-')}${back}`;
								break;
							case ':-':
								line = `${front}${padding(table.columnSizes[i] + (settings.spacePadding * 2) - 3, '-')}${back}${spacePadding}`;
								break;
						}
						break;
				}

				return line;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let body = this.formatLines(table.body, table.format, table.columnSizes, settings).map(line => {
			let cellPadding = padding(settings.spacePadding);
			return line.map((cell, i) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatted = [formatLine, ...body];
		if (table.header) {
			formatted = [header, formatLine, ...body];
		}

		return formatted.join('\n');
	}

	// vscode.Commands
	// vscode.Command
	private enableForCurrentScopeCommand = (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
		const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
		if (!scopes.includes(editor.document.languageId)) {
			scopes.push(editor.document.languageId);
			this.config.update("markdownGrammarScopes", scopes, true);
			this.registerFormatterForScope(editor.document.languageId);
			vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
		}
	}

	// vscode.Commands
	private moveColumnRightCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let tables = getExtensionTables(editor.selection);
		let header = this.getColumnIndexFromRange(tables[0], editor.selection);
		var leftHeaderIndex = header;
		if ((leftHeaderIndex + 1) >= tables[0].columns) {
			return;
		}
		var rightHeaderIndex = header + 1;
		let table = this.flipColumn(tables[0], leftHeaderIndex, rightHeaderIndex);
		edit.replace(table.range, table.notFormatted());
	}

	// vscode.Commands
	private moveColumnLeftCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		let tables = getExtensionTables(editor.selection);
		let header = this.getColumnIndexFromRange(tables[0], editor.selection);
		var leftHeaderIndex = header - 1;
		if (leftHeaderIndex < 0) {
			return;
		}
		var rightHeaderIndex = header;
		let table = this.flipColumn(tables[0], leftHeaderIndex, rightHeaderIndex);
		edit.replace(table.range, table.notFormatted());
	}

	// vscode.DocumentFormattingEditProvider implementation
	provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		return this.formatDocument(document, fullDocumentRange);
	}

	// vscode.DocumentRangeFormattingEditProvider implementation
	provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
		return this.formatDocument(document, range);
	}
}
