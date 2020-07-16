export enum MarkdownTableFormatterDelimiterRowPadding {
	None = "None",
	FollowSpacePadding = "Follow Space Padding",
	SingleApaceAlways = "Single Space Always",
	AlignmentMarker = "Alignment Marker"
}
export enum MarkdownTableFormatterGlobalColumnSizes {
	Disabled = "Disabled",
	SameColumnSize = "Same Column Size",
	SameTableSize = "Same Table Size"
}

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
	allowEmptyRows: boolean;
	telemetry: boolean;
	toString(): string;
}
