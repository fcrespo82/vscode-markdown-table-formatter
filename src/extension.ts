// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableFormatterProvider } from './table-formatter';

const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
let config = vscode.workspace.getConfiguration('markdown-table-formatter');
let enable: boolean = config.get<boolean>('enable', true);

vscode.workspace.onDidChangeConfiguration(e => {
    config = vscode.workspace.getConfiguration('markdown-table-formatter');
    enable = config.get<boolean>('enable', true);
    registerScopes();
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {

    const commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {
        const scopes = config.get<string[]>('markdownGrammarScopes', []);
        if (!scopes.includes(editor.document.languageId)) {
            scopes.push(editor.document.languageId);
            vscode.languages.registerDocumentFormattingEditProvider(editor.document.languageId, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider(editor.document.languageId, markdownTableFormatterProvider);
            config.update("markdownGrammarScopes", scopes, true);
            vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
        }
    });

    context.subscriptions.push(commandEnable);
    registerScopes();

    return Promise.resolve(true);
}

function registerScopes() {
    if (enable) {
        const scopes = config.get<string[]>('markdownGrammarScopes', []);
        scopes.forEach(scope => {
            vscode.languages.registerDocumentFormattingEditProvider(scope, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider(scope, markdownTableFormatterProvider);
        });
    }
}

// this method is called when your extension is deactivated
export function deactivate(): Promise<boolean> {
    return Promise.resolve(true);
}