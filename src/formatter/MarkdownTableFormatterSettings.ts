import { MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterDelimiterRowPadding } from "./MarkdownTableFormatterProvider";

export default interface MarkdownTableFormatterSettings {
	enable: boolean;
	spacePadding: number;
	keepFirstAndLastPipes: boolean;
	defaultTableJustification: string;
	markdownGrammarScopes: string[];
	limitLastColumnPadding: boolean;
	removeColonsIfSameAsDefault: boolean;
	globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes;
	delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding;
}
