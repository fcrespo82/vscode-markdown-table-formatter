import * as vscode from 'vscode';
import { MDTable, MDTableSortDirection } from './MDTable';
import { hasAscendingSortIndicator, setAscSortIndicator, setDescSortIndicator } from './sort-utils';
import { tablesIn } from './utils';


export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		let lens = tables.map(table => {
			return table.header.map((header, i) => {

				let sort = hasAscendingSortIndicator(header) ? MDTableSortDirection.Desc : MDTableSortDirection.Asc;
				let indicator = hasAscendingSortIndicator(header) ? setDescSortIndicator(header) : setAscSortIndicator(header);
				return new vscode.CodeLens(table.range, {
					title: `${indicator}`,
					command: 'sortTable',
					arguments: [table, i, sort]
				});
			});
		});

		return lens.reduce((acc, val) => acc.concat(val), []);
	}
}
