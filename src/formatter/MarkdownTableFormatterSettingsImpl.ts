import { WorkspaceConfiguration, workspace } from "vscode";
import MarkdownTableFormatterSettings from "./MarkdownTableFormatterSettings";
import { MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterDelimiterRowPadding } from "./MarkdownTableFormatterProvider";

export default class MarkdownTableFormatterSettingsImpl implements MarkdownTableFormatterSettings {

	private config: WorkspaceConfiguration;

	constructor() {
		this.config = workspace.getConfiguration('markdown-table-formatter');
		workspace.onDidChangeConfiguration((changeEvent) => {
			if (changeEvent.affectsConfiguration('markdown-table-formatter')) {
				this.config = workspace.getConfiguration('markdown-table-formatter');
			}
		});
	}

	get enable(): boolean {
		return this.config.get<boolean>('enable', true);
	}
	get spacePadding(): number {
		return this.config.get<number>('spacePadding', 1);
	}
	get keepFirstAndLastPipes(): boolean {
		return this.config.get<boolean>('keepFirstAndLastPipes', true);
	}
	get defaultTableJustification(): string {
		return this.config.get<string>('defaultTableJustification', 'Left');
	}
	get markdownGrammarScopes(): string[] {
		return this.config.get<string[]>('markdownGrammarScopes', ['markdown']);
	}
	get limitLastColumnPadding(): boolean {
		return this.config.get<boolean>('limitLastColumnPadding', false);
	}
	get removeColonsIfSameAsDefault(): boolean {
		return this.config.get<boolean>('removeColonsIfSameAsDefault', false);
	}
	get globalColumnSizes(): MarkdownTableFormatterGlobalColumnSizes {
		return this.config.get<MarkdownTableFormatterGlobalColumnSizes>('globalColumnSizes', MarkdownTableFormatterGlobalColumnSizes.Disabled);
	}
	get delimiterRowPadding(): MarkdownTableFormatterDelimiterRowPadding {
		return this.config.get<MarkdownTableFormatterDelimiterRowPadding>('delimiterRowPadding', MarkdownTableFormatterDelimiterRowPadding.None);
	}
	get limitTableSize(): number {
		return this.config.get<number>('limitTableSize', 80);
	}
}
