import { WorkspaceConfiguration, workspace } from "vscode";
import MarkdownTableFormatterSettings from "./MarkdownTableFormatterSettings";
import { MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterDelimiterRowPadding } from "./MarkdownTableFormatterProvider";

export default class MarkdownTableFormatterSettingsImpl implements MarkdownTableFormatterSettings {

	private config: WorkspaceConfiguration;

	private static instance: MarkdownTableFormatterSettings;

	public static get shared(): MarkdownTableFormatterSettings {
		if (this.instance === null) {
			this.instance = new MarkdownTableFormatterSettingsImpl();
		}
		return this.instance;
	}

	private constructor() {
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
	get enableSort(): boolean {
		return this.config.get<boolean>('enableSort', true);
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
	get removeColonsIfSameAsDefault(): boolean {
		return this.config.get<boolean>('removeColonsIfSameAsDefault', false);
	}
	get markdownGrammarScopes(): string[] {
		return this.config.get<string[]>('markdownGrammarScopes', ['markdown']);
	}
	get globalColumnSizes(): MarkdownTableFormatterGlobalColumnSizes {
		return this.config.get<MarkdownTableFormatterGlobalColumnSizes>('globalColumnSizes', MarkdownTableFormatterGlobalColumnSizes.Disabled);
	}
	get delimiterRowPadding(): MarkdownTableFormatterDelimiterRowPadding {
		return this.config.get<MarkdownTableFormatterDelimiterRowPadding>('delimiterRowPadding', MarkdownTableFormatterDelimiterRowPadding.None);
	}
	get limitLastColumnWidth(): boolean {
		return this.config.get<boolean>('limitLastColumnWidth', false);
	}
	get telemetry(): boolean {
		return this.config.get<boolean>('telemetry', true);
	}
}
