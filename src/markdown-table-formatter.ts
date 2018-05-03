// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableFormatterProvider } from './table-formatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();

    const commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {
        const config = vscode.workspace.getConfiguration('markdown-table-formatter');
        const scopes = config.get<string[]>('markdownGrammarScopes');
        if (scopes && !scopes.includes(editor.document.languageId)) {
            scopes.push(editor.document.languageId);
            vscode.languages.registerDocumentFormattingEditProvider(editor.document.languageId, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider(editor.document.languageId, markdownTableFormatterProvider);
            config.update("markdownGrammarScopes", scopes, true);
            vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
        }
    });

    context.subscriptions.push(commandEnable);

    const config = vscode.workspace.getConfiguration('markdown-table-formatter');
    const scopes = config.get<string[]>('markdownGrammarScopes');

    if (scopes) {
        scopes.forEach(scope => {
            vscode.languages.registerDocumentFormattingEditProvider(scope, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider(scope, markdownTableFormatterProvider);
        });
    }

}

// this method is called when your extension is deactivated
export function deactivate() {
}