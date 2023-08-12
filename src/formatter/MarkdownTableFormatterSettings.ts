export enum MarkdownTableFormatterDelimiterRowPadding {
	None = "None",
	FollowSpacePadding = "Follow Space Padding",
	SingleApaceAlways = "Single Space Always",
	AlignmentMarker = "Alignment Marker"
}
export enum MarkdownTableFormatterLimitLastRowLength {
	None = "None",
	EditorWordWrap = "Follow editor's wordWrapColumn",
	HeaderRowLength = "Follow header row length"
}
export enum MarkdownTableFormatterGlobalColumnSizes {
	Disabled = "Disabled",
	SameColumnSize = "Same Column Size",
	SameTableSize = "Same Table Size"
}

export enum MarkdownTableFormatterDefaultTableJustification {
	Left = "Left",
	Right = "Right",
	Center = "Center"
}

export default interface MarkdownTableFormatterSettings {
	enable?: boolean;
	enableSort?: boolean;
	sortCaseInsensitive?: boolean;
	spacePadding?: number;
	keepFirstAndLastPipes?: boolean;
	defaultTableJustification?: MarkdownTableFormatterDefaultTableJustification;
	removeColonsIfSameAsDefault?: boolean;
	markdownGrammarScopes?: string[];
	globalColumnSizes?: MarkdownTableFormatterGlobalColumnSizes;
	delimiterRowPadding?: MarkdownTableFormatterDelimiterRowPadding;
	limitLastColumnLength?: MarkdownTableFormatterLimitLastRowLength;
	allowEmptyRows?: boolean;
}
