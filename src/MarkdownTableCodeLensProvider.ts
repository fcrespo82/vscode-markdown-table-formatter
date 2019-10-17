import * as vscode from 'vscode';
import { MDTable } from './MDTable';
import { tablesIn } from './utils';

export class MarkdownTableCodeLensProvider implements vscode.CodeLensProvider {
	provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		let lens = tables.map(table => {
			return table.header.map(header => {
				return new vscode.CodeLens(table.range, {
					title: `Sort by ${header}`,
					tooltip: `Tooltip sort by ${header}`,
					arguments: [table, header],
					command: 'sortTable'
				} as vscode.Command);
			});
		});

		return lens.reduce((acc, val) => acc.concat(val), []);
	}
}
