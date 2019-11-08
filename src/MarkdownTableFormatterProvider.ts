import * as vscode from 'vscode';
import { MarkdownTable } from './MarkdownTable';
import { discoverMaxColumnSizes, discoverMaxTableSizes, getSettings, tablesIn } from './utils';
import { setExtensionTables, getExtensionTables } from './extension';

export class MarkdownTableFormatterProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {

    public disposables: vscode.Disposable[] = [];
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('markdown-table-formatter');
    }

    public register() {
        if (this.config.get<boolean>("enable", true)) {
            const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
            scopes.forEach(scope => {
                this.registerFormatterForScope(scope);
            });
            this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", this.enableForCurrentScopeCommand));

            vscode.workspace.onDidOpenTextDocument(document => {
                let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
                setExtensionTables(tablesIn(document, fullDocumentRange));
            });

            vscode.workspace.onDidChangeTextDocument(change => {
                let fullDocumentRange = change.document.validateRange(new vscode.Range(0, 0, change.document.lineCount + 1, 0));
                setExtensionTables(tablesIn(change.document, fullDocumentRange));
            });

            this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnRight", this.moveColumnRight));
            this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.moveColumnLeft", this.moveColumnLeft));

        }
    }

    private moveColumnRight(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
        let tables = getExtensionTables(editor.selection);
    }

    private moveColumnLeft(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
        let tables = getExtensionTables(editor.selection);
    }

    provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
        return this.formatDocument(document, fullDocumentRange);
    }

    provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        return this.formatDocument(document, range);
    }

    private formatDocument(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
        let edits: vscode.TextEdit[] = [];
        // This check is in case some grammar is removed and VSCode is not reloaded yet
        if (!getSettings().markdownGrammarScopes.includes(document.languageId)) {
            vscode.window.showWarningMessage(`Markdown table formatter is not enabled for '${document.languageId}' language!`);
            return edits;
        }
        let tables: MarkdownTable[] = setExtensionTables(tablesIn(document, range));

        if (getSettings().globalColumnSizes === 'Same column size') {
            let maxSize = discoverMaxColumnSizes(tables);
            tables.forEach(table => {
                table.columnSizes = maxSize;
            });
        } if (getSettings().globalColumnSizes === 'Same table size') {
            let tableSizes = discoverMaxTableSizes(tables, getSettings().spacePadding);
            tables.forEach((table, i) => {
                table.columnSizes = tableSizes[i];
            });
        }
        tables.forEach(table => {
            edits.push(new vscode.TextEdit(table.range, table.formatted(getSettings())));
        });
        return edits;
    }

    private enableForCurrentScopeCommand = (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
        const scopes = this.config.get<string[]>('markdownGrammarScopes', []);
        if (!scopes.includes(editor.document.languageId)) {
            scopes.push(editor.document.languageId);
            this.config.update("markdownGrammarScopes", scopes, true);
            this.registerFormatterForScope(editor.document.languageId);
            vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language!`);
        }
    }

    private registerFormatterForScope(scope: vscode.DocumentSelector) {
        this.disposables.push(vscode.languages.registerDocumentFormattingEditProvider(scope, this));
        this.disposables.push(vscode.languages.registerDocumentRangeFormattingEditProvider(scope, this));
    }

    dispose() {
        this.disposables.map(d => d.dispose());
        this.disposables = [];
    }

}

