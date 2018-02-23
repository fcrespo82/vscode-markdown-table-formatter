A simple markdown plugin to format tables.

Based on the awesome [Improved Markdown table commands for TextMate](http://www.leancrew.com/all-this/2012/03/improved-markdown-table-commands-for-textmate/) work from [Dr. Drang (@drdrang)](https://twitter.com/drdrang)

[Changelog](https://github.com/fcrespo82/vscode-markdown-table-formatter/blob/master/CHANGELOG.md)


## Usage

There are two basic ways of using this plugin.

1. Select the table you want to format and then hit `alt-shift-T` to format it.
2. If you didn't select any table the entire document (default) will be scanned, by the plugin, for tables and format all of them.

### Settings & Keybindings

- formatOnSave: Format tables when document is saved?;
- autoSelectEntireDocument: Select entire document if selection is empty;
- spacePadding: How many spaces between left and right of each column content;
- keepFirstAndLastPipes: Keep first and last pipes \"|\" in table formatting. Tables are easier to format when pipes are kept;
- defaultTableJustification: Defines the default justification for tables that have only a \"-\" on the formatting line;
- markdownGrammarScopes: File language grammar that will be considered Markdown by this package (comma-separated). \nRun \"Markdown Table Formatter: Enable for current language\" command to add current editor grammar to this setting.;
- limitLastColumnPadding: Do not pad the last column to more than your editor's preferredLineLength setting.;

## Tips

### Enable Markdown Table Formatter for the current file type

To enable Markdown Table Formatter for your current file type: put your cursor in the file, open the Command Palette <kbd>^ (CONTROL)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> (<kbd>⌘ (CMD)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> for mac), and run the `Markdown Table Formatter: Enable for current language` command. This will add language grammar from current editor to the list of languages in the settings for the Markdown Table Formatter package. You can edit this setting manually later if you want to.

Formatting selection should work regardless though.
