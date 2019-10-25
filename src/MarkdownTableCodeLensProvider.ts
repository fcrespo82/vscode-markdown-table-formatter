import * as vscode from 'vscode';
import { MDTable, MDTableSortDirection } from './MDTable';
import { sortIndicator } from './sort-utils';
import { tablesIn } from './utils';

export interface MarkdownTableSortOptions {
	table_index: number;
	header_index: number;
	sort_direction: MDTableSortDirection;
	defaultOrder: string[][];
}

export interface SortCommandArguments {
	table: MDTable;
	options: MarkdownTableSortOptions;
	document: vscode.TextDocument;
}

export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {

	public setActiveSort(document: vscode.TextDocument, table: MDTable, sortOptions: MarkdownTableSortOptions | undefined) {

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
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		let lenses = tables.map((table, table_index) => {
			return [...table.header.map((header, header_index) => {

				var sort = MDTableSortDirection.Asc;
				var indicator = `${header.trim()}`;
				var defaultOrder = table.body;
				if (this._activeSortPerDocumentAndTable && this._activeSortPerDocumentAndTable[document.uri.path] && this._activeSortPerDocumentAndTable[document.uri.path][table.id] && this._activeSortPerDocumentAndTable[document.uri.path][table.id]!.table_index === table_index && this._activeSortPerDocumentAndTable[document.uri.path][table.id]!.header_index === header_index) {

					switch (this._activeSortPerDocumentAndTable[document.uri.path][table.id]!.sort_direction) {
						case MDTableSortDirection.Asc:
							sort = MDTableSortDirection.Desc;
							indicator = `${header.trim()} ${sortIndicator.ascending}`;
							break;
						case MDTableSortDirection.Desc:
							sort = MDTableSortDirection.Asc;
							indicator = `${header.trim()} ${sortIndicator.descending}`;

							break;
					}
					defaultOrder = this._activeSortPerDocumentAndTable[document.uri.path][table.id]!.defaultOrder;
				}

				return new vscode.CodeLens(table.range, {
					title: `${indicator}`,
					command: 'sortTable',
					arguments: [{ document, table, options: { table_index, header_index, sort_direction: sort, defaultOrder } }]
				});
			}), new vscode.CodeLens(table.range, {
				title: `resetTableSort`,
				command: 'resetTable',
				arguments: [{ document, table, options: undefined }]
			})];
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
