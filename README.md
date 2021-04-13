# Markdown table formatter

![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fcrespo82.markdown-table-formatter.svg)
![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/fcrespo82.markdown-table-formatter.svg)
![Rating](https://vsmarketplacebadge.apphb.com/rating-star/fcrespo82.markdown-table-formatter.svg)

A (not so) simple markdown plugin to format tables and other table related features.

[Changelog](https://github.com/fcrespo82/vscode-markdown-table-formatter/blob/master/CHANGELOG.md)

## Help needed
First of all, thanks all users for the awesome community that was built here. I never imagined that this extension would be used by more than 48K users with 160K downloads.

I need your help to ask the VSCode team a feature that will improve this extension. I want to be able to make more clear for users the columns to sort. To be able to do it I need some help from the community.

If you would be so kind and [read this feature request](https://github.com/microsoft/vscode/issues/118391). After that, if you like it, help me up voting (+1/:thumbsup:) it for the VS Code team implement it.

Thanks again for the support, bug reports and PRs!

### Donating

If you like this extension, please consider [donating](https://www.paypal.com/donate?hosted_button_id=73E3UAJNR2VM4) and/or take a moment to [write a review](https://marketplace.visualstudio.com/items?itemName=fcrespo82.markdown-table-formatter&ssr=false#review-details) and share on [Facebook](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview) or [Twitter](https://twitter.com/intent/tweet?text=Just%20discovered%20this%20extension%20on%20the%20%23VSMarketplace&url=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview)

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
- **limitLastColumnWidth**: Do not extend last column to more than your editor's wordWrapColumn setting;
- **telemetry**: Send usage statistics.

## Tips

### Enable Markdown Table Formatter for the current file type

To enable Markdown Table Formatter for your current file type: put your cursor in the file, open the Command Palette <kbd>^ (CONTROL)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> (<kbd>⌘ (CMD)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> for mac), and run the `Markdown Table Formatter: Enable for current language` command. This will add language grammar from current editor to the list of languages in the settings for the Markdown Table Formatter package. You can edit this setting manually later if you want to.