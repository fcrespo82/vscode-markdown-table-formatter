# Markdown table formatter

![Installs](https://vsmarketplacebadge.apphb.com/installs-short/fcrespo82.markdown-table-formatter.svg)
![Rating](https://vsmarketplacebadge.apphb.com/rating-star/fcrespo82.markdown-table-formatter.svg)

A simple markdown plugin to format tables.

Based on the awesome [Improved Markdown table commands for TextMate](http://www.leancrew.com/all-this/2012/03/improved-markdown-table-commands-for-textmate/) work from [Dr. Drang (@drdrang)](https://twitter.com/drdrang)

[Changelog](https://github.com/fcrespo82/vscode-markdown-table-formatter/blob/master/CHANGELOG.md)


## Usage

Uses VSCode `Format Document` and `Format Selection`

### Settings & Keybindings

- **enable**: Enable or disable the formatter;
- **enableSort**: Enable or disable table sorter;
- **spacePadding**: How many spaces between left and right of each column content;
- **keepFirstAndLastPipes**: Keep first and last pipes "|" in table formatting. Tables are easier to format when pipes are kept;
- **defaultTableJustification**: Defines the default justification for tables that have only "-" on the formatting line;
- **removeColonsIfSameAsDefault**: Remove colons from the format line if the justification is the same as default;
- **markdownGrammarScopes**: File language grammar that will be considered Markdown by this package.
- **globalColumnSizes**: Format tables locally, with same column sizes or same table size.

## Tips

### Enable Markdown Table Formatter for the current file type

To enable Markdown Table Formatter for your current file type: put your cursor in the file, open the Command Palette <kbd>^ (CONTROL)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> (<kbd>⌘ (CMD)</kbd>+<kbd>⇧ (SHIFT)</kbd>+<kbd>P</kbd> for mac), and run the `Markdown Table Formatter: Enable for current language` command. This will add language grammar from current editor to the list of languages in the settings for the Markdown Table Formatter package. You can edit this setting manually later if you want to.

- - -


If you like this extension, please consider [donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2KJXQPK7AAVU6) and/or take a moment to [write a review](https://marketplace.visualstudio.com/items?itemName=fcrespo82.markdown-table-formatter#review-details) and share on <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview">Facebook</a> or <a href="https://www.twitter.com/home?status=Just%20discovered%20this%20on%20the%20%23VSMarketplace%3A%20https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dfcrespo82.markdown-table-formatter%23overview">Twitter</a>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="2KJXQPK7AAVU6">
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypalobjects.com/pt_BR/i/scr/pixel.gif" width="1" height="1">
</form>

