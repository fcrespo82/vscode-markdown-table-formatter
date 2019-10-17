import * as vscode from 'vscode';
import { tablesIn } from "./utils";
import { MDTable } from './MDTable';

export class MarkdownTableCodeActionsProvider implements vscode.CodeActionProvider, vscode.CodeActionProviderMetadata {
	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables: MDTable[] = tablesIn(document, fullDocumentRange);

		return tables.map(table => {
			let action = new vscode.CodeAction("Action", vscode.CodeActionKind.Refactor);
			action.diagnostics = [new vscode.Diagnostic(table.range, 'Sort Table', vscode.DiagnosticSeverity.Information)];
			return action;
		});
	}

	providedCodeActionKinds = [vscode.CodeActionKind.Refactor];



}