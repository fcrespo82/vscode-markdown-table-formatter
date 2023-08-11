import * as vscode from 'vscode';
import {MarkdownTableDecorationProvider} from './decoration/MarkdownTableDecorationProvider';
import {MarkdownTableFormatterProvider} from './formatter/MarkdownTableFormatterProvider';
import MarkdownTableFormatterSettingsImpl from './formatter/MarkdownTableFormatterSettingsImpl';
import {MarkdownTableSortCodeLensProvider} from "./sorter/MarkdownTableSortCodeLensProvider";

export async function activate(context: vscode.ExtensionContext): Promise<boolean> {
	const config = MarkdownTableFormatterSettingsImpl.shared;

	const markdownTableFormatterProvider = new MarkdownTableFormatterProvider(config);
	const markdownTableCodeLensProvider = new MarkdownTableSortCodeLensProvider(config);
	const markdownTableDecorationProvider = new MarkdownTableDecorationProvider(config);

	context.subscriptions.push(markdownTableFormatterProvider);
	context.subscriptions.push(markdownTableCodeLensProvider);
	context.subscriptions.push(markdownTableDecorationProvider);

	markdownTableFormatterProvider.register();
	markdownTableCodeLensProvider.register();
	markdownTableDecorationProvider.register();

	vscode.workspace.onDidChangeConfiguration(changeConfigurationEvent => {
		if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter.enable') ||
			changeConfigurationEvent.affectsConfiguration('markdown-table-formatter.markdownGrammarScopes')) {
			if (config.enable) {
				markdownTableFormatterProvider.dispose();
				markdownTableFormatterProvider.register();
				markdownTableDecorationProvider.dispose();
				markdownTableDecorationProvider.register();
			} else {
				markdownTableFormatterProvider.dispose();
				markdownTableDecorationProvider.dispose();
			}
		}
		if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter.enableSort') ||
			changeConfigurationEvent.affectsConfiguration('markdown-table-formatter.markdownGrammarScopes')) {
			if (config.enableSort) {
				markdownTableCodeLensProvider.dispose();
				markdownTableCodeLensProvider.register();
			} else {
				markdownTableCodeLensProvider.dispose();
			}
		}
	});

	return Promise.resolve(true);
}

export async function deactivate(): Promise<boolean> {
	return Promise.resolve(true);
}