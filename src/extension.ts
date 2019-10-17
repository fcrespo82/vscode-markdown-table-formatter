// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableCodeLensProvider } from "./MarkdownTableCodeLensProvider";
import { MarkdownTableFormatterProvider } from './table-formatter';
import { MDTable } from './MDTable';

const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
const markdownTableCodeLensProvider = new MarkdownTableCodeLensProvider();

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
            vscode.languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: editor.document.languageId }, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider({ scheme: 'file', language: editor.document.languageId }, markdownTableFormatterProvider);
            config.update("markdownGrammarScopes", scopes, true);
            vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
        }
    });

    vscode.commands.registerTextEditorCommand('sortTable', (editor, edit, ...args) => {
        let table: MDTable = args[0];
        let header = args[1];
        table.body.sort(sortFunctionHeader(header, table));

        editor.edit(editBuilder => {
            editBuilder.replace(table.range, table.notFormatted());
        });
    });

    context.subscriptions.push(commandEnable);
    registerScopes();

    return Promise.resolve(true);
}

function registerScopes() {
    if (enable) {
        const scopes = config.get<string[]>('markdownGrammarScopes', []);
        scopes.forEach(scope => {
            vscode.languages.registerDocumentFormattingEditProvider({ scheme: 'file', language: scope }, markdownTableFormatterProvider);
            vscode.languages.registerDocumentRangeFormattingEditProvider({ scheme: 'file', language: scope }, markdownTableFormatterProvider);
            vscode.languages.registerCodeLensProvider({ scheme: 'file', language: scope }, markdownTableCodeLensProvider);
        });
    }
}

function sortFunctionHeader(header: string, table: MDTable) {
    let index = table.header.findIndex(v => {
        return v === header;
    });
    return function sortFunction(a: any, b: any) {
        if (a[index] === b[index]) {
            return 0;
        }
        else {
            return (a[index] < b[index]) ? -1 : 1;
        }
    };
}
// this method is called when your extension is deactivated
export function deactivate(): Promise<boolean> {
    return Promise.resolve(true);
}