import * as vscode from 'vscode';
import { MarkdownTable, MarkdownTableSortDirection } from './MarkdownTable';
import { sortIndicator, sortCommand, resetCommand } from './sort-utils';
import { tablesIn } from './utils';
import { setExtensionTables, getExtensionTables } from './extension';

export interface MarkdownTableSortOptions {
	table_index: number;
	header_index: number;
	sort_direction: MarkdownTableSortDirection;
	defaultOrder: string[][];
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

	public register() {
		if (this.config.get<boolean>("enableSort", true)) {
			const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
			scopes.forEach(scope => {
				this.registerCodeLensForScope(scope);
			});
			this.disposables.push(vscode.commands.registerTextEditorCommand('sortTable', sortCommand));
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

	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MarkdownTable[] = setExtensionTables(tablesIn(document, fullDocumentRange));

		let lenses = tables.filter(table => {
			return table.bodyLines > 1;
		}).map((table, table_index) => {
			if (table.header === undefined) {
				return [];
			}
			return table.codeLenses;
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}

	dispose() {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}
}
