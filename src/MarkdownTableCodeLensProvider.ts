import * as vscode from 'vscode';
import { MDTable, MDTableSortDirection } from './MDTable';
import { tablesIn } from './utils';
import { hasAscendingSortIndicator, cleanSortIndicator, sortIndicator, hasDescendingSortIndicator, toggleSortIndicator } from './sort-utils';


export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		let lens = tables.map(table => {
			return table.header.map((header, i) => {
				let sort = hasDescendingSortIndicator(header) ? MDTableSortDirection.Asc : MDTableSortDirection.Desc;
				return new vscode.CodeLens(table.range, {
					title: `Sort by ${toggleSortIndicator(header)}`,
					command: 'sortTable',
					arguments: [table, i, sort]
				});
			});
		});

		return lens.reduce((acc, val) => acc.concat(val), []);
	}
}
