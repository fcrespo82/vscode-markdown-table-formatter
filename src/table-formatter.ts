import * as vscode from 'vscode';
import { tableRegex } from './regex';
import { formatTable } from './format-table';
import { MarkdownTableFormatterSettings } from './interfaces';

function getSettings(): MarkdownTableFormatterSettings {
    // This iplementation should be overrided for any custom editor/platform the plugin is used
    let vscodeConfig = vscode.workspace.getConfiguration('markdown-table-formatter');
    // Forcing cast because defaults are defined in packages.json, so always have a value
    return {
        spacePadding: <number>vscodeConfig.get<number>('spacePadding'),
        keepFirstAndLastPipes: <boolean>vscodeConfig.get<boolean>('keepFirstAndLastPipes'),
        defaultTableJustification: <string>vscodeConfig.get<string>('defaultTableJustification'),
        markdownGrammarScopes: <string[]>vscodeConfig.get<string[]>('markdownGrammarScopes'),
        limitLastColumnPadding: <boolean>vscodeConfig.get<boolean>('limitLastColumnPadding'),
        removeColonsIfSameAsDefault: <boolean>vscodeConfig.get<boolean>('removeColonsIfSameAsDefault')
    };
}

export class MarkdownTableFormatterProvider implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {

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
        let tables: any[] = this.tablesIn(document, range);
        tables.forEach(table => {
            edits.push(new vscode.TextEdit(table.range, formatTable(table.match, getSettings())));
        });
        return edits;
    }

    private tablesIn(document: vscode.TextDocument, range: vscode.Range) {
        var items: any = [];

        const text = document.getText(range);
        var matches;
        while ((matches = tableRegex.exec(text)) !== null) {
            let offset = document.offsetAt(range.start);
            let start = document.positionAt(offset+matches.index);
            let text = matches[0].trim();
            let end = document.positionAt(offset+matches.index+text.length);
            let nrange = new vscode.Range(start, end);
            items.push({ match: matches, range: nrange });
        }
        return items;
    }
}
