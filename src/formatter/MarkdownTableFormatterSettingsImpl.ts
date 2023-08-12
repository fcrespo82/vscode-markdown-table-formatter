import {workspace, WorkspaceConfiguration} from "vscode";
import MarkdownTableFormatterSettings, {MarkdownTableFormatterDefaultTableJustification, MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterLimitLastRowLength, MarkdownTableFormatterWhichCodeLensesToShow} from "./MarkdownTableFormatter.types";

export default class MarkdownTableFormatterSettingsImpl implements MarkdownTableFormatterSettings {

	private config: WorkspaceConfiguration;

	private static instance: MarkdownTableFormatterSettings;

	public static get shared(): MarkdownTableFormatterSettings {
		if (this.instance == null) {
			this.instance = new MarkdownTableFormatterSettingsImpl();
		}
		return this.instance;
	}

	/**
	 * Create a MarkdownTableFormatterSettings from a MarkdownTableFormatterSettings like object
	 * @param options MarkdownTableFormatterSettings like object
	 */
	public static create(options: MarkdownTableFormatterSettings): MarkdownTableFormatterSettings {
		options.toString = MarkdownTableFormatterSettingsImpl.prototype.toString
		return options
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
	get sortCaseInsensitive(): boolean {
		return this.config.get<boolean>('sortCaseInsensitive', false);
	}
	get spacePadding(): number {
		return this.config.get<number>('spacePadding', 1);
	}
	get keepFirstAndLastPipes(): boolean {
		return this.config.get<boolean>('keepFirstAndLastPipes', true);
	}
	get defaultTableJustification(): MarkdownTableFormatterDefaultTableJustification {
		return this.config.get<MarkdownTableFormatterDefaultTableJustification>('defaultTableJustification', MarkdownTableFormatterDefaultTableJustification.Left);
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
	get limitLastColumnLength(): MarkdownTableFormatterLimitLastRowLength {
		return this.config.get<MarkdownTableFormatterLimitLastRowLength>('limitLastColumnLength', MarkdownTableFormatterLimitLastRowLength.None);
	}
	get whichCodeLensesToShow(): MarkdownTableFormatterWhichCodeLensesToShow[] {
		return this.config.get<MarkdownTableFormatterWhichCodeLensesToShow[]>('whichCodeLensesToShow', [MarkdownTableFormatterWhichCodeLensesToShow.Format, MarkdownTableFormatterWhichCodeLensesToShow.Sort, MarkdownTableFormatterWhichCodeLensesToShow.ReSort]);
	}
	get allowEmptyRows(): boolean {
		return this.config.get<boolean>('allowEmptyRows', true);
	}

	public toString(): string {
		return `{ enable: ${this.enable}, enableSort: ${this.enableSort},  sortCaseInsensitive: ${this.sortCaseInsensitive}, spacePadding: ${this.spacePadding}, keepFirstAndLastPipes: ${this.keepFirstAndLastPipes}, defaultTableJustification: ${this.defaultTableJustification}, removeColonsIfSameAsDefault: ${this.removeColonsIfSameAsDefault}, globalColumnSizes: ${this.globalColumnSizes}, delimiterRowPadding: ${this.delimiterRowPadding}, limitLastColumnLength: ${this.limitLastColumnLength} }`;
	}
}
