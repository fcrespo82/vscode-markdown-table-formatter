import * as vscode from 'vscode';
import { formatTable } from './format-table';
import { MarkdownTableFormatterSettings } from './interfaces';
import { tableRegex } from './regex';
import XRegExp = require('xregexp');

function getSettings(): MarkdownTableFormatterSettings {
    // This iplementation should be overrided for any custom editor/platform the plugin is used
    let mtf_config = vscode.workspace.getConfiguration('markdown-table-formatter');
    // Forcing cast because defaults are defined in packages.json, so always have a value
    return {
        spacePadding: mtf_config.get<number>('spacePadding', 1),
        keepFirstAndLastPipes: mtf_config.get<boolean>('keepFirstAndLastPipes', true),
        defaultTableJustification: mtf_config.get<string>('defaultTableJustification', 'Left'),
        markdownGrammarScopes: mtf_config.get<string[]>('markdownGrammarScopes', ['markdown']),
        limitLastColumnPadding: mtf_config.get<boolean>('limitLastColumnPadding', false),
        removeColonsIfSameAsDefault: mtf_config.get<boolean>('removeColonsIfSameAsDefault', false)
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

    private tablesIn(document: vscode.TextDocument, range: vscode.Range): any[] {
        var items: any[] = [];

        const text = document.getText(range);
        var pos = 0, match;
        while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
            pos = match.index + match[0].length;
            let offset = document.offsetAt(range.start);
            let start = document.positionAt(offset + match.index);
            let text = match[0].replace(/^\n+|\n+$/g, '');
            let end = document.positionAt(offset + match.index + text.length);
            let new_range = new vscode.Range(start, end);
            items.push({ match: match, range: new_range });
        }
        return items;
    }
}
