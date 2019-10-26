// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableCodeLensProvider } from "./MarkdownTableCodeLensProvider";
import { MarkdownTableFormatterProvider } from './MarkdownTableFormatterProvider';

export const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
export const markdownTableCodeLensProvider = new MarkdownTableCodeLensProvider();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {
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