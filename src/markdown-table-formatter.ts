// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TableFormatter } from './table-formatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const tableFormatter = new TableFormatter();

    const commandFormat = vscode.commands.registerTextEditorCommand("markdown-table-formatter.format", (editor, edit) => {
        const languageId = editor.document.languageId;
        const config = vscode.workspace.getConfiguration('markdown-table-formatter');
        const scopes = config.get<string[]>('markdownGrammarScopes');
        if (scopes && scopes.includes(languageId)) {
            tableFormatter.format(editor, false);
        }
    });

    const commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {
        const config = vscode.workspace.getConfiguration('markdown-table-formatter');
        const scopes = config.get<string[]>('markdownGrammarScopes');
        if (scopes && !scopes.includes(editor.document.languageId)) {
            scopes.push(editor.document.languageId);
        }
        config.update("markdownGrammarScopes", scopes, true);
        vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
    });

    const formatOnSave = vscode.workspace.onWillSaveTextDocument((event) => {
        console.log(event.document.fileName);
        const edits: vscode.TextEdit[] = [];

        event.waitUntil(new Promise<vscode.TextEdit[]>((resolve, reject) => {

            edits.push(vscode.TextEdit.insert(new vscode.Position(0, 0), `${event.document.uri}`));

            resolve(edits);
        }));
    });

    context.subscriptions.push(commandFormat);
    context.subscriptions.push(commandEnable);
    context.subscriptions.push(formatOnSave);
}

// this method is called when your extension is deactivated
export function deactivate() {
}