import * as vscode from 'vscode';
import { tableRegex } from './regex';
import { formatTable } from './format-table';
import { MarkdownTableFormatterSettings } from './interfaces';

function getSettings(): MarkdownTableFormatterSettings {
    // This iplementation should be overrided for any custom editor/platform the plugin is used
    let vscodeConfig = vscode.workspace.getConfiguration('markdown-table-formatter');
    // Forcing cast because defaults are defined in packages.json, so always have a value
    return {
        formatOnSave: <boolean>vscodeConfig.get<boolean>('formatOnSave'),
        autoSelectEntireDocument: <boolean>vscodeConfig.get<boolean>('autoSelectEntireDocument'),
        spacePadding: <number>vscodeConfig.get<number>('spacePadding'),
        keepFirstAndLastPipes: <boolean>vscodeConfig.get<boolean>('keepFirstAndLastPipes'),
        defaultTableJustification: <string>vscodeConfig.get<string>('defaultTableJustification'),
        markdownGrammarScopes: <string[]>vscodeConfig.get<string[]>('markdownGrammarScopes'),
        limitLastColumnPadding: <boolean>vscodeConfig.get<boolean>('limitLastColumnPadding')
    };
}

export class TableFormatter {
    public format(editor: vscode.TextEditor, force: boolean = false) {

        const emptySelection = editor.selections.every(s => s.isEmpty);

        if (!getSettings().markdownGrammarScopes.includes(editor.document.languageId)) {
            return undefined;
        }
        if (force || (emptySelection && getSettings().autoSelectEntireDocument)) {
            let tables: any[] = this.tablesIn(editor.document);
            editor.edit(editBuilder => {
                tables.forEach(table => {
                    editBuilder.replace(table.range, formatTable(table.match, getSettings()));
                });
            });
        } else {
            let tables: any[] = this.tablesIn(editor.document, editor.selections);
            editor.edit(editBuilder => {
                tables.forEach(table => {
                    editBuilder.replace(table.range, formatTable(table.match, getSettings()));
                });
            });
        }
    }

    public tablesIn(document: vscode.TextDocument, forRanges: vscode.Range[] = []) {
        var items: any = [];

        // Think in a way to optimize this
        if (forRanges.length === 0) {
            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);
            const textRange = new vscode.Range(0,
                firstLine.range.start.character,
                document.lineCount - 1,
                lastLine.range.end.character);
            forRanges.push(textRange);
        }
        forRanges.forEach(range => {
            const text = document.getText();
            let match = tableRegex.exec(text);
            while (match !== null) {
                if (match) {
                    let start = document.positionAt(match.index);
                    let end = document.positionAt(match.index + match[0].length);
                    let nrange = new vscode.Range(start, end);
                    let r = nrange.intersection(range);
                    if (r) {
                        items.push({ match: match, range: r });
                    }
                }
                match = tableRegex.exec(text);
            }
        });

        return items;
    }
}