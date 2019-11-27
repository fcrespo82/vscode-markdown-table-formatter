import * as vscode from 'vscode';
import { getTable, setExtensionTables } from '../extension';
import { MarkdownTable } from '../MarkdownTable';
import { tablesIn } from '../MarkdownTableUtils';
import { MarkdownTableSortDirection } from './MarkdownTableSortDirection';
import MarkdownTableSortOptions from './MarkdownTableSortOptions';
import { cleanSortIndicator, sortIndicator } from './MarkdownTableSortUtils';

export class MarkdownTableSortCodeLensProvider implements vscode.CodeLensProvider {

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
		if (this.config.get<boolean>("enableSort", true)) {
			const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
			scopes.forEach(scope => {
				this.registerCodeLensForScope(scope);
			});
			this.disposables.push(vscode.commands.registerTextEditorCommand('sortTable', this.sortCommand, this));
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
		if (header_index !== undefined && header_index >= 0 && sort_direction) {
			this._activeSortPerDocumentAndTable[document.uri.path][table_id] = {
				header_index, sort_direction
			};
		} else {
			delete this._activeSortPerDocumentAndTable[document.uri.path][table_id];
		}
	}

	public getActiveSort(document: vscode.TextDocument, table_id: string, header_index: number): MarkdownTableSortOptions | undefined {
		if (this._activeSortPerDocumentAndTable && this._activeSortPerDocumentAndTable[document.uri.path]) {
			return this._activeSortPerDocumentAndTable[document.uri.path][table_id];
		}
		return undefined;
	}

	private _activeSortPerDocumentAndTable: { [index: string]: { [index: string]: MarkdownTableSortOptions | undefined } } = {};

	private getSortIndicator(direction: MarkdownTableSortDirection) {
		switch (direction) {
			case MarkdownTableSortDirection.Asc:
				return sortIndicator.separator + sortIndicator.ascending;
			case MarkdownTableSortDirection.Desc:
				return sortIndicator.separator + sortIndicator.descending;
			default:
				return "";
		}
	}
	private codeLensForTable(table: MarkdownTable, document: vscode.TextDocument): vscode.CodeLens[] {
		return table.header.map((header, header_index) => {

			// FIXME: Improve
			let activeSort = this.getActiveSort(document, table.id, header_index);
			let direction = undefined;

			var indicator = `${header.trim()}`;
			if (header.trim() === "") {
				indicator = `Column ${header_index + 1}`;
			}

			if (activeSort && activeSort.header_index === header_index) {
				indicator = `${indicator + this.getSortIndicator(activeSort.sort_direction)}`;
				direction = activeSort.sort_direction;
			}

			return new vscode.CodeLens(table.range, {
				title: `${indicator}`,
				command: 'sortTable',
				arguments: [table.id, header_index, direction]
			});
		}).concat(
			new vscode.CodeLens(table.range, { title: table.id.toString(), command: '' }));
	}

	public sortTable(table: MarkdownTable, headerIndex: number, sortDirection: MarkdownTableSortDirection) {
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

			let sort = MarkdownTableSortDirection.None;
			switch (direction) {
				case MarkdownTableSortDirection.Asc:
					sort = MarkdownTableSortDirection.Desc;
					break;
				default:
					sort = MarkdownTableSortDirection.Asc;
					break;
			}
			this.setActiveSort(editor.document, id, index, sort);

			editor.edit(editBuilder => {
				editBuilder.replace(table!.range, this.sortTable(table!, index, sort));
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
				editBuilder.replace(table!.range, this.sortTable(table!, 0, MarkdownTableSortDirection.None));
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
			return this.codeLensForTable(table, document);
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
