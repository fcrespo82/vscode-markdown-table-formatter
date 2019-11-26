import * as vscode from 'vscode';
import { setExtensionTables, getTable } from '../extension';
import { MarkdownTable } from '../MarkdownTable';
import MarkdownTableFormatterSettings from '../formatter/MarkdownTableFormatterSettings';
import MarkdownTableSortOptions from './MarkdownTableSortOptions';
import { cleanSortIndicator } from './MarkdownTableSortUtils';
import { getSettings, tablesIn } from '../MarkdownTableUtils';
import MarkdownTableSortCommandArguments from './MarkdownTableSortCommandArguments';
import { MarkdownTableSortDirection } from './MarkdownTableSortDirection';

export class MarkdownTableSortCodeLensProvider implements vscode.CodeLensProvider {

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

	public setActiveSort(document: vscode.TextDocument, table_id: string, header_index: number | undefined, sort_direction: MarkdownTableSortDirection | undefined) {

		if (!this._activeSortPerDocumentAndTable) {
			this._activeSortPerDocumentAndTable = {};
		}
		if (!this._activeSortPerDocumentAndTable[document.uri.path]) {
			this._activeSortPerDocumentAndTable[document.uri.path] = {};
		}
		if (header_index && sort_direction) {
			this._activeSortPerDocumentAndTable[document.uri.path][table_id] = {
				header_index, sort_direction
			};
		} else {
			delete this._activeSortPerDocumentAndTable[document.uri.path][table_id];
		}
	}

	private _activeSortPerDocumentAndTable: { [index: string]: { [index: string]: MarkdownTableSortOptions | undefined } } = {};

	private codeLensForTable(table: MarkdownTable): vscode.CodeLens[] {
		return table.header.map((header, header_index) => {
			// var sort = MarkdownTableSortDirection.None;
			var indicator = `${header.trim()}`;

			return new vscode.CodeLens(table.range, {
				title: `${indicator}`,
				command: 'sortTable',
				arguments: [table.id, header_index, undefined]
			});
		}).concat(
			new vscode.CodeLens(table.range, { title: 'Reset', command: 'resetSort', arguments: [table.id, undefined] }),
			new vscode.CodeLens(table.range, { title: table.id.toString(), command: '' }));
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
		let id = args[0];
		let index = args[1];
		let direction = args[2];

		let table = getTable(id);
		if (table) {
			this.setActiveSort(editor.document, id, index, direction);

			editor.edit(editBuilder => {
				editBuilder.replace(table!.range, this.sortTable(table!, index, direction, getSettings()));
			});
		}

	}

	// vscode.Command
	private resetCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
		let id = args[0];

		let table = getTable(id);
		if (table) {
			this.setActiveSort(editor.document, id, undefined, MarkdownTableSortDirection.None);

			editor.edit(editBuilder => {
				// FIXME: Reset should do what?
				editBuilder.replace(table!.range, this.sortTable(table!, 0, MarkdownTableSortDirection.None, getSettings()));
			});
		}
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
