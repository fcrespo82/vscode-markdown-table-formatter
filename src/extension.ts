// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    var commandFormat = vscode.commands.registerTextEditorCommand("markdown-table-formatter.format", (editor, edit) => {

        vscode.window.showInformationMessage('Tables formatted!');
    });

    var commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {

        var config = vscode.workspace.getConfiguration('martdown-table-formatter');

        var array = config.get("markdownGrammarScopes");

        //array.push(editor.document.languageId);

        //config.update

        vscode.window.showInformationMessage(`Markdown table formatter enabled for ${editor.document.languageId} language scope!`);
    });

    context.subscriptions.push(commandFormat);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

