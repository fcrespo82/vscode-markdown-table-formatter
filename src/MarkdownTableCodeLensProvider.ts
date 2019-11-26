import * as vscode from 'vscode';
import { MarkdownTable, MarkdownTableSortDirection } from './MarkdownTable';
import { cleanSortIndicator } from './sort-utils';
import { tablesIn, getSettings } from './utils';
import { setExtensionTables, getExtensionTables } from './extension';
import MarkdownTableFormatterSettings from './MarkdownTableFormatterSettings';

export interface MarkdownTableSortOptions {
	header_index: number;
	sort_direction: MarkdownTableSortDirection;
}

export interface SortCommandArguments {
	table: MarkdownTable;
	options: MarkdownTableSortOptions;
	document: vscode.TextDocument;
}

export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {

	public disposables: vscode.Disposable[] = [];
	private config: vscode.WorkspaceConfiguration;
	// private tables!: MarkdownTable[];

	constructor() {
		this.config = vscode.workspace.getConfiguration('markdown-table-formatter');
	}

	dispose() {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register() {
		if (this.config.get<boolean>("enableSort", true)) {
			const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
			scopes.forEach(scope => {
				this.registerCodeLensForScope(scope);
			});
			this.disposables.push(vscode.commands.registerTextEditorCommand('sortTable', this.sortCommand));
			// this.disposables.push(vscode.commands.registerTextEditorCommand('resetTable', resetCommand));

			vscode.workspace.onDidOpenTextDocument(document => {
				let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
				setExtensionTables(tablesIn(document, fullDocumentRange));
			});

			vscode.workspace.onDidChangeTextDocument(change => {
				let fullDocumentRange = change.document.validateRange(new vscode.Range(0, 0, change.document.lineCount + 1, 0));
				setExtensionTables(tablesIn(change.document, fullDocumentRange));
			});

		}
	}

	private registerCodeLensForScope(scope: vscode.DocumentSelector) {
		this.disposables.push(vscode.languages.registerCodeLensProvider(scope, this));
	}

	public setActiveSort(document: vscode.TextDocument, table: MarkdownTable, sortOptions: MarkdownTableSortOptions | undefined) {

		if (!this._activeSortPerDocumentAndTable) {
			this._activeSortPerDocumentAndTable = {};
		}
		if (!this._activeSortPerDocumentAndTable[document.uri.path]) {
			this._activeSortPerDocumentAndTable[document.uri.path] = {};
		}
		this._activeSortPerDocumentAndTable[document.uri.path][table.id] = sortOptions;
	}

	private _activeSortPerDocumentAndTable: { [index: string]: { [index: string]: MarkdownTableSortOptions | undefined } } = {};

	private codeLensForTable(table: MarkdownTable): vscode.CodeLens[] {
		return table.header.map((header, header_index) => {
			// var sort = MarkdownTableSortDirection.None;
			var indicator = `${header.trim()}`;

			return new vscode.CodeLens(table.range, {
				title: `${indicator}`,
				command: 'sortTable',
				arguments: [{
					table: table,
					options: {
						header_index: header_index,
						sort_direction: undefined
					}
				}]
			});
		}).concat(new vscode.CodeLens(table.range, { title: table.id.toString(), command: '' }));
	}

	public sortTable(table: MarkdownTable, headerIndex: number, sortDirection: MarkdownTableSortDirection, settings: MarkdownTableFormatterSettings) {
		table.header.forEach((header, i) => {
			if (i !== headerIndex) {
				table.header[i] = cleanSortIndicator(header);
			}
		});
		switch (sortDirection) {
			case MarkdownTableSortDirection.Asc:
				table.body.sort((a: any, b: any) => {
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() < b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
			case MarkdownTableSortDirection.Desc:
				table.body.sort((a: any, b: any) => {
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() > b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
		}
		return table.notFormatted();
	}

	// vscode.Commands
	// vscode.Command
	private sortCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
		let sortArguments: SortCommandArguments = args[0];

		this.setActiveSort(editor.document, sortArguments.table, sortArguments.options);

		editor.edit(editBuilder => {
			editBuilder.replace(sortArguments.table.range, this.sortTable(sortArguments.table, sortArguments.options.header_index, sortArguments.options.sort_direction, getSettings()));
		});
	}

	// vscode.Command
	private resetCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
		let sortArguments: SortCommandArguments = args[0];

		this.setActiveSort(sortArguments.document, sortArguments.table, undefined);

		editor.edit(editBuilder => {
			editBuilder.replace(sortArguments.table.range, sortArguments.table.notFormattedDefault());
		});
	}

	// vscode.CodeLensProvider implementation
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MarkdownTable[] = setExtensionTables(tablesIn(document, fullDocumentRange));

		let lenses = tables.filter(table => {
			return table.bodyLines > 1;
		}).map((table, table_index) => {
			if (table.header === undefined) {
				return [];
			}
			return this.codeLensForTable(table);
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
