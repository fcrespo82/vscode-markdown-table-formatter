export interface MarkdownTableFormatterSettings {
    spacePadding: number;
    keepFirstAndLastPipes: boolean;
    defaultTableJustification: string;
    markdownGrammarScopes: string[];
    limitLastColumnPadding: boolean;
    removeColonsIfSameAsDefault: boolean;
    trimValues: boolean;
}

