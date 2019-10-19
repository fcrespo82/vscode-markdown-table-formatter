import * as vscode from 'vscode';
import { MDTable, MDTableSortDirection } from './MDTable';
import { sortIndicator } from './sort-utils';
import { tablesIn } from './utils';

export interface MarkdownTableSortOptions {
	table: MDTable;
	table_index: number;
	header_index: number;
	sort_direction: MDTableSortDirection;
	document: vscode.TextDocument;
}

export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {

	private _activeSort: MarkdownTableSortOptions | undefined;
	public setActiveSort(sort: MarkdownTableSortOptions) {
		this._activeSort = sort;
	}
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		let lenses = tables.map((table, table_index) => {
			return table.header.map((header, header_index) => {

				var sort = MDTableSortDirection.Asc;
				var indicator = `${header.trim()}`;

				if (this._activeSort && this._activeSort!.table_index === table_index && this._activeSort!.header_index === header_index) {

					switch (this._activeSort.sort_direction) {
						case MDTableSortDirection.Asc:
							sort = MDTableSortDirection.Desc;
							indicator = `${header.trim()} ${sortIndicator.ascending}`;
							break;
						case MDTableSortDirection.Desc:
							sort = MDTableSortDirection.Asc;
							indicator = `${header.trim()} ${sortIndicator.descending}`;
							break;
					}
				}

				return new vscode.CodeLens(table.range, {
					title: `${indicator}`,
					command: 'sortTable',
					arguments: [{ table, table_index, header_index, sort_direction: sort, document }]
				});
			});
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
