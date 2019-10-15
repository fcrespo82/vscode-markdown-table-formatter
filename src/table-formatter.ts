import * as vscode from 'vscode';
import { MarkdownTableFormatterSettings } from './interfaces';
import { MDTable } from './MDTable';
import { tableRegex } from './regex';
import XRegExp = require('xregexp');

export function getSettings(): MarkdownTableFormatterSettings {
    // This iplementation should be overrided for any custom editor/platform the plugin is used
    let mtf_config = vscode.workspace.getConfiguration('markdown-table-formatter');

    // Forcing cast because defaults are defined in packages.json, so always have a value
    return {
        spacePadding: mtf_config.get<number>('spacePadding', 1),
        keepFirstAndLastPipes: mtf_config.get<boolean>('keepFirstAndLastPipes', true),
        defaultTableJustification: mtf_config.get<string>('defaultTableJustification', 'Left'),
        markdownGrammarScopes: mtf_config.get<string[]>('markdownGrammarScopes', ['markdown']),
        limitLastColumnPadding: mtf_config.get<boolean>('limitLastColumnPadding', false),
        removeColonsIfSameAsDefault: mtf_config.get<boolean>('removeColonsIfSameAsDefault', false),
        globalColumnSizes: mtf_config.get<boolean>('globalColumnSizes', false),
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
        let tables: MDTable[] = this.tablesIn(document, range);
        if (getSettings().globalColumnSizes) {
            let maxSize = tables.map(table => {
                return table.columnSizes;
            }).reduce((p, c) => {
                let length = p.length > c.length ? p.length : c.length;
                for (let index = 0; index < length; index++) {
                    if (p[index] > c[index]) {
                        c[index] = p[index];
                    }
                }
                return c;
            });
            tables.forEach(table => {
                table.columnSizes = maxSize;
                edits.push(new vscode.TextEdit(table.range, table.formatted(getSettings())));
            });
        } else {
            tables.forEach(table => {
                edits.push(new vscode.TextEdit(table.range, table.formatted(getSettings())));
            });
        }
        return edits;
    }

    private tablesIn(document: vscode.TextDocument, range: vscode.Range): MDTable[] {
        var items: MDTable[] = [];

        const text = document.getText(range);
        var pos = 0, match;
        while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
            pos = match.index + match[0].length;
            let offset = document.offsetAt(range.start);
            let start = document.positionAt(offset + match.index);
            let text = match[0].replace(/^\n+|\n+$/g, '');
            let end = document.positionAt(offset + match.index + text.length);
            let table = new MDTable(offset, start, end, text);
            items.push(table);
        }
        return items;
    }
}
