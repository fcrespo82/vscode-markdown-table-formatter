import { MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterDelimiterRowPadding } from "./MarkdownTableFormatterProvider";

export default interface MarkdownTableFormatterSettings {
	enable: boolean;
	enableSort: boolean;
	spacePadding: number;
	keepFirstAndLastPipes: boolean;
	defaultTableJustification: string;
	removeColonsIfSameAsDefault: boolean;
	markdownGrammarScopes: string[];
	globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes;
	delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding;
	limitLastColumnWidth: boolean;
}
