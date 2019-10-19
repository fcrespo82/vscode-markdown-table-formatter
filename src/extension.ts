// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableCodeLensProvider } from "./MarkdownTableCodeLensProvider";
import { sortCommand } from './sort-utils';
import { MarkdownTableFormatterProvider } from './table-formatter';

const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
export const markdownTableCodeLensProvider = new MarkdownTableCodeLensProvider();

let config = vscode.workspace.getConfiguration('markdown-table-formatter');
let enable: boolean = config.get<boolean>('enable', true);

let disposables: vscode.Disposable[] = [];

vscode.workspace.onDidChangeConfiguration(e => {
    config = vscode.workspace.getConfiguration('markdown-table-formatter');
    enable = config.get<boolean>('enable', true);
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {

    const commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {
        const scopes = config.get<string[]>('markdownGrammarScopes', []);
        if (!scopes.includes(editor.document.languageId)) {
            scopes.push(editor.document.languageId);
            config.update("markdownGrammarScopes", scopes, true);
            registerExtensionFor(editor.document.languageId);
            vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
        }
    });

    const commandSort = vscode.commands.registerTextEditorCommand('sortTable', sortCommand);

    context.subscriptions.push(commandEnable, commandSort);
    disposables.push(commandEnable, commandSort);

    registerScopes();

    return Promise.resolve(true);
}

let registerExtensionFor = (scope: string) => {
    const dfep = vscode.languages.registerDocumentFormattingEditProvider(scope, markdownTableFormatterProvider);
    const dfrep = vscode.languages.registerDocumentRangeFormattingEditProvider(scope, markdownTableFormatterProvider);
    const clp = vscode.languages.registerCodeLensProvider(scope, markdownTableCodeLensProvider);
    disposables.push(dfep, dfrep, clp);
};

function registerScopes() {
    if (enable) {
        const scopes = config.get<string[]>('markdownGrammarScopes', []);
        scopes.forEach(scope => {
            registerExtensionFor(scope);
        });
    } else {
        disposables.map(d => d.dispose());
    }
}


// this method is called when your extension is deactivated
export function deactivate(): Promise<boolean> {
    disposables.map(d => d.dispose());
    return Promise.resolve(true);
}