# Markdown table formatter

![Installs](https://img.shields.io/visual-studio-marketplace/i/fcrespo82.markdown-table-formatter)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/fcrespo82.markdown-table-formatter)
![Rating](https://img.shields.io/visual-studio-marketplace/stars/fcrespo82.markdown-table-formatter)

A (not so) simple markdown plugin to format tables and other table related features.

[Changelog](https://github.com/fcrespo82/vscode-markdown-table-formatter/blob/master/CHANGELOG.md)

## Features
- Format markdown tables
- Sort tables
- Organize columns moving it left/right

## Usage

Uses VSCode `Format Document` and `Format Selection`

### Settings & Keybindings

- **enable**: Enable or disable the formatter;
- **enableSort**: Enable or disable table sorter;
- **spacePadding**: How many spaces between left and right of each column content;
- **keepFirstAndLastPipes**: Keep first and last pipes "|" in table formatting. Tables are easier to format when pipes are kept;
- **defaultTableJustification**: Defines the default justification for tables that have only "-" on the formatting line;
- **removeColonsIfSameAsDefault**: Remove colons from the format line if the justification is the same as default;
- **globalColumnSizes**: Format tables locally, with same column sizes or same table size;
- **delimiterRowPadding**: Calculates the column sizes based on all tables on the document;
- **limitLastColumnLength**: Control how the last column size is calculated;
- **sortCaseInsensitive**: Sort table columns without considering text case;
- **allowEmptyLines**: Format tables even if lines have less columns than header;
- **markdownGrammarScopes**: File language grammar that will be considered Markdown by this packagfernando8

## Tips

### Enable Markdown Table Formatter for the current file type

To enable Markdown Table Formatter for your current file type: put your cursor in the file, open the Command Palette <kbd>^ (CONTROL)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> (<kbd>⌘ (CMD)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> for mac), and run the `Markdown Table Formatter: Enable for current language` command. This will add language grammar from current editor to the list of languages in the settings for the Markdown Table Formatter package. You can edit this setting manually later if you want to.

## Thanks

Thanks all users for the awesome community that was built here. I never imagined that this extension would be used by more than ![installs](https://img.shields.io/visual-studio-marketplace/i/fcrespo82.markdown-table-formatter?label=%20) users with ![installs](https://img.shields.io/visual-studio-marketplace/d/fcrespo82.markdown-table-formatter?label=%20) downloads.

Thanks for the support, bug reports and PRs!

## Donating

If you like this extension, please consider [donating](https://www.paypal.com/donate?hosted_button_id=73E3UAJNR2VM4) and/or take a moment to [write a review](https://marketplace.visualstudio.com/items?itemName=fcrespo82.markdown-table-formatter&ssr=false#review-details) and share on [Facebook](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview) or [Twitter](https://twitter.com/intent/tweet?text=Just%20discovered%20this%20extension%20on%20the%20%23VSMarketplace&url=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview)