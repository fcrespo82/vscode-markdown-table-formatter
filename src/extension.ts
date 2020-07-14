// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MarkdownTableDecorationProvider } from './decoration/MarkdownTableDecorationProvider';
import { MarkdownTableFormatterProvider } from './formatter/MarkdownTableFormatterProvider';
import { MarkdownTable } from './MarkdownTable';
import { MarkdownTableSortCodeLensProvider } from "./sorter/MarkdownTableSortCodeLensProvider";
import { MTFReporter } from './telemetry/MTFReporter';
import MarkdownTableFormatterSettingsImpl from './formatter/MarkdownTableFormatterSettingsImpl';

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

export function getTable(id: string): MarkdownTable | undefined {
	return _extensionTables.find(table => {
		return table.id === id;
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): Promise<boolean> {
	let config = MarkdownTableFormatterSettingsImpl.shared;
	const reporter = new MTFReporter(context, config.telemetry);
	const markdownTableFormatterProvider = new MarkdownTableFormatterProvider();
	const markdownTableCodeLensProvider = new MarkdownTableSortCodeLensProvider();
	const markdownTableDecorationProvider = new MarkdownTableDecorationProvider();

	context.subscriptions.push(markdownTableFormatterProvider);
	context.subscriptions.push(markdownTableCodeLensProvider);
	context.subscriptions.push(markdownTableDecorationProvider);

	markdownTableFormatterProvider.register();
	markdownTableCodeLensProvider.register();
	markdownTableDecorationProvider.register();

	vscode.workspace.onDidChangeConfiguration(changeConfigurationEvent => {
		if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter')) {
			if (config.enable) {
				markdownTableFormatterProvider.register();
			} else {
				markdownTableFormatterProvider.dispose();
			}
		}
	});
	vscode.workspace.onDidChangeConfiguration(changeConfigurationEvent => {
		if (changeConfigurationEvent.affectsConfiguration('markdown-table-formatter')) {
			let config = MarkdownTableFormatterSettingsImpl.shared;
			if (config.enable) {
				markdownTableCodeLensProvider.register();
			} else {
				markdownTableCodeLensProvider.dispose();
			}
		}
	});

	return Promise.resolve(true);
}

// this method is called when your extension is deactivated
export function deactivate(): Promise<boolean> {
	return Promise.resolve(true);
}