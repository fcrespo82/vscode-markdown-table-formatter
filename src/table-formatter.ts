import * as vscode from 'vscode';
import { MarkdownTableFormatterSettings } from './interfaces';
import { MDTable } from './MDTable';
import { discoverMaxColumnSizes, discoverMaxTableSizes, tablesIn } from './utils';

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
        globalColumnSizes: mtf_config.get<string>('globalColumnSizes', 'Same column size'),
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
        let tables: MDTable[] = tablesIn(document, range);
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

}

