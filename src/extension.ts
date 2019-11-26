// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTable } from './MarkdownTable';
import { MarkdownTableFormatterProvider } from './formatter/MarkdownTableFormatterProvider';
import { MarkdownTableSortCodeLensProvider } from "./sorter/MarkdownTableSortCodeLensProvider";
import { tablesIn } from './MarkdownTableUtils';

export const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
export const markdownTableCodeLensProvider = new MarkdownTableSortCodeLensProvider();

var _extensionTables: MarkdownTable[];

export function setExtensionTables(tables: MarkdownTable[]): MarkdownTable[] {
    _extensionTables = tables;
    return _extensionTables;
}

export function getExtensionTables(range: vscode.Range): MarkdownTable[] {
    return _extensionTables.filter(t => {
        return t.range.contains(range);
    });
}

let decorationsEnabled = false;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {

    const markdownTableDecoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'orange',
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        overviewRulerColor: 'orange',
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        light: {
            // this color will be used in light color themes
            backgroundColor: 'darkorange'
        },
        dark: {
            // this color will be used in dark color themes
            backgroundColor: 'darkorange'
        }
    });

    vscode.commands.registerTextEditorCommand("markdown-table-formatter.toggleDebug", (editor, edit) => {
        decorationsEnabled = !decorationsEnabled;
        if (decorationsEnabled) {
            let fullDocumentRange = editor.document.validateRange(new vscode.Range(0, 0, editor.document.lineCount + 1, 0));

            let tables = tablesIn(editor.document, fullDocumentRange);
            let ranges = tables.map(t => {
                return t.range;
            });
            editor.setDecorations(markdownTableDecoration, ranges);
        } else {
            editor.setDecorations(markdownTableDecoration, []);
        }
    });

    markdownTableFormatterProvider.register();
    markdownTableCodeLensProvider.register();

    vscode.workspace.onDidChangeConfiguration(changeConfigurationEvent => {
        if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter')) {
            let config = vscode.workspace.getConfiguration('markdown-table-formatter');
            if (config.get<boolean>("enable", true)) {
                if (markdownTableFormatterProvider.disposables.length === 0) {
                    markdownTableFormatterProvider.register();
                }
            } else {
                markdownTableFormatterProvider.dispose();
            }
        }
    });
    vscode.workspace.onDidChangeConfiguration(changeConfigurationEvent => {
        if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter')) {
            let config = vscode.workspace.getConfiguration('markdown-table-formatter');
            if (config.get<boolean>("enableSort", true)) {
                if (markdownTableCodeLensProvider.disposables.length === 0) {
                    markdownTableCodeLensProvider.register();
                }
            } else {
                markdownTableCodeLensProvider.dispose();
            }
        }
    });

    return Promise.resolve(true);
}

// this method is called when your extension is deactivated
export function deactivate(): Promise<boolean> {
    markdownTableFormatterProvider.dispose();
    markdownTableCodeLensProvider.dispose();

    return Promise.resolve(true);
}