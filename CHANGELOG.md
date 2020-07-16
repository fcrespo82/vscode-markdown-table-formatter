# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.1.0] - 2020-07-16

### Added
- Limit last column width: Don't let the last column expand more than the wordWrapColumn. [#20](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/20)
- Telemetry: send usage statistics. This will help in future development of this extension, but you can turn it of in settings and no personal data is ever sent.
- Format tables even if lines have less columns than header. [#24](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/24)

### Fixed
- Case where backticks were not interpreted corectly if near a pipe sign '|'. [#26](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/26)
- Some cases the extension got stuck when in files not related to markdown. [#27](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/27)

## [2.0.5] - 2020-07-09

### Changed
- Changed keybindings for "Move column left/right" to `ctrl+m left` and `ctrl+m right` the old ones conflicted with the built-in fix [#25](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/25)

### Fixed
- Fix a case where multiple backticks were not escaped correctly [#26](https://github.com/fcrespo82/vscode-markdown-table-formatter/issues/26)


## [2.0.4] - 2020-04-10

### Changed
- Better error message when the header and body have different column numbers #24


## [2.0.3] - 2020-01-24

### Fixed
- Fix bug #19 where the extension would fail to format a table with columns header and lines with 1 character


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
- Don't treat \`\|\` (backticked pipes) as a table cell


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
- Sometimes, when formatting, a line was wrongly NEWed.


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
