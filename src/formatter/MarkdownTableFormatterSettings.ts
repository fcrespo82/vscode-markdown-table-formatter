import { WorkspaceConfiguration } from "vscode";

export default interface MarkdownTableFormatterSettings {
	enable: boolean;
    spacePadding: number;
    keepFirstAndLastPipes: boolean;
    defaultTableJustification: string;
    markdownGrammarScopes: string[];
    limitLastColumnPadding: boolean;
    removeColonsIfSameAsDefault: boolean;
    globalColumnSizes: string;
	delimiterRowPadding: string;
	
	
}
