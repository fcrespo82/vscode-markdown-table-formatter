import { WorkspaceConfiguration, workspace } from "vscode";
import { MarkdownTableFormatterGlobalColumnSizes } from "./MarkdownTableFormatterGlobalColumnSizes";
import { MarkdownTableFormatterDelimiterRowPadding } from "./MarkdownTableFormatterDelimiterRowPadding";
import MarkdownTableFormatterSettings from "./MarkdownTableFormatterSettings";

export default class MarkdownTableFormatterSettingsImpl implements MarkdownTableFormatterSettings {

	private config: WorkspaceConfiguration;

	constructor() {
		this.config = workspace.getConfiguration('markdown-table-formatter');

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
	get globalColumnSizes(): string {
		return this.config.get<string>('globalColumnSizes', MarkdownTableFormatterGlobalColumnSizes.Disabled);
	}
	get delimiterRowPadding(): string {
		return this.config.get<string>('delimiterRowPadding', MarkdownTableFormatterDelimiterRowPadding.None);
	}
}
