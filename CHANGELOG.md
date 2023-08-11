# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.?.?] - 2023-??-??

### Added

- Suport for case insensitive sorting
- Context menus for moving columns

### Changed

- Improve internal sorting algorithm
- Improve activation events

## [2.2.4] - 2021-10-24

### Fixed

- Fixed a regex error where the extension wrongly detect a row with numbers as a format row

## [2.2.3] - 2021-08-31

### Fixed

- Fixed extension not working on CRLF line endings

## [2.2.2] - 2021-08-25

### Fixed

- Removed preview tag from the extension

## [2.2.1] - 2021-08-25

### Fixed

- High CPU load on big files Issue (Issue [#35](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/35))

## [2.2.0] - 2021-07-04

### Added

- Option to focus on an error when the extension shows a notification of a problem.

### Changed

- Simplified parser to better support the markdown syntax used by **Visual Studio Code**, this means that pipes (`|`) inside cells _SHOULD_ be escaped with a backslash (`\`) otherwise they will be interpreted as column dividers. (Issue [#42](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/42))

### Fixed

- Formatting of tables that are in lists or indented.

## [2.1.8] - 2021-05-13

### Fixed

- Pipes missing after formatting (Issue [#40](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/40))

## [2.1.7] - 2021-04-29

### Changed

- Better code structure

### Fixed

- Dependency vulnerabilities
- Extension not activating (changed from webpack to esbuild)

## [2.1.6] - 2021-04-27 [YANKED]

## [2.1.5] - 2021-04-26 [YANKED]

## [2.1.4] - 2021-03-05

### Fixed

- Correct ordering when a column only has numbers

## [2.1.3] - 2020-08-14

### Removed

- Removed telemetry.

## [2.1.2] - 2020-08-13

### Fixed

- The extension was unable to format a table with one column. (Issue [#31](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/31))

## [2.1.1] - 2020-08-02

### Fixed

- Command **Enable for current language** not found. [#30](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/30)
- Command **Sort table by header** should not be visible in the command palette. [#30](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/30)

## [2.1.0] - 2020-07-16

### Added

- Limit last column width: Don't let the last column expand more than the wordWrapColumn. (Issue [#20](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/20))
- Telemetry: send usage statistics. This will help in future development of this extension, but you can turn it of in settings and no personal data is ever sent.
- Format tables even if lines have less columns than header. (Issue [#24](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/24))

### Fixed

- Case where backtick were not interpreted correctly if near a pipe sign '|'. (Issue [#26](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/26))
- Some cases the extension got stuck when in files not related to markdown. (Issue [#27](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/27))

## [2.0.5] - 2020-07-09

### Changed

- Changed keybindings for "Move column left/right" to `ctrl+m left` and `ctrl+m right` the old ones conflicted with the built-in fix. (Issue [#25](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/25))

### Fixed

- Fix a case where multiple backtick were not escaped correctly. (Issue [#26](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/26))

## [2.0.4] - 2020-04-10

### Changed

- Better error message when the header and body have different column numbers (Issue [#24](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/24))

## [2.0.3] - 2020-01-24

### Fixed

- Fix a bug where the extension would fail to format a table with columns header and lines with 1 character. (Issue [#19](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/19))

## [2.0.2] - 2019-11-27

### Changed

- A lot of internal fixes and improvements

## [2.0.1] - 2019-11-27

### Fixed

- Various bugs

## [2.0.0] - 2019-11-22

### Added

- Global column sizes - options: Disabled, Same column size, Same table size (default: Disabled)
- Sort table by CodeLens
- Reorder columns (Alt+Shift+Left or Right arrow)

### Changed

- A lot of internal fixes and improvements

### Removed

- Limit Last Column Padding - If you use this feature please let me know and I'll find a way to add it back. For now, if you rely on this, keep on the older version.

## [1.4.3] - 2019-05-13

## [1.4.1] - 2019-01-30

### Fixed

- Ignore pipe symbols between pairs of backtick #4
- Repeat character inserted at end of table on format #6

## [1.4.0] - 2018-11-07

### Added

- Configuration to remove the colons from format line if the justification is the same as default (default: false)

### Fixed

- Format tables that have no colons or dashes on the format line (e.g. |||)
- Configuration for `defaultTableJustification` type was wrong

## [1.3.3] - 2018-10-09

## [1.3.2] - 2018-07-19

### Fixed

- Don't treat \`\|\` (backtick pipes) as a table cell

## [1.3.1] - 2018-07-19

### Added

- Option to disable the formatter

## [1.3.0] - 2018-05-03

The extensions was rewritten to take advantage of the Formatter provider VSCode offers.

### Changed

- Format on save
  - Now it uses the config provided by VSCode
- Auto Select Entire Document
  - Now registers a formatter provider for entire document and for selection

### Fixed

- Sometimes, when formatting, a line was wrongly inserted.

## [1.2.1] - 2018-05-02

## [1.2.0] - 2018-02-26

### Added

- Format on save

## [1.1.0] - 2018-02-26

## [1.0.1] - 2018-02-26

### Fixed

- Removed code for 'format on save', feature not ready.

## [1.0.0] - 2018-02-23

- First version
