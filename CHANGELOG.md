# Change Log
All notable changes to the "vscode-markdown-table-formatter" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.


## [2.0.4] - 2020-04-10

### Changed
* Better error message when the header and body have different column numbers #24


## [2.0.3] - 2020-01-24

### Fixed
* Fix bug #19 where the extension would fail to format a table with columns header and lines with 1 character


## [2.0.2] - 2019-11-27

### Changed
* A lot of internal fixes and improvements 


## [2.0.1] - 2019-11-27

### Fixed
* Various bugs


## [2.0.0] - 2019-11-22

### Added
* Global column sizes - options: Disabled, Same column size, Same table size (default: Disabled)
* Sort table by CodeLens
* Reorder columns (Alt+Shift+Left or Right arrow)

### Changed
* A lot of internal fixes and improvements 

### Removed
* Limit Last Column Padding - If you use this feature please let me know and I'll find a way to add it back. For now, if you rely on this, keep on the older version.

## [1.4.3] - 2019-05-13

## [1.4.1] - 2019-01-30

### Fixed
* Ignore pipe symbols between pairs of backtick #4
* Repeat character inserted at end of table on format #6


## [1.4.0] - 2018-11-07

### Added
* Configuration to remove the colons from format line if the justification is the same as default (default: false)

### Fixed
* Format tables that have no colons or dashes on the format line (e.g. |||)
* Configuration for `defaultTableJustification` type was wrong


## [1.3.3] - 2018-10-09


## [1.3.2] - 2018-07-19

### Fixed
* Don't treat \`\|\` (backticked pipes) as a table cell


## [1.3.1] - 2018-07-19

### Added
* Option to disable the formatter


## [1.3.0] - 2018-05-03

The extensions was rewritten to take advantage of the Formatter provider VSCode offers.

### Changed
* Format on save
    - Now it uses the config provided by VSCode
* Auto Select Entire Document
    - Now registers a formatter provider for entire document and for selection

### Fixed
* Sometimes, when formatting, a line was wrongly NEWed.


## [1.2.1] - 2018-05-02


## [1.2.0] - 2018-02-26

### Added
* Format on save


## [1.1.0] - 2018-02-26


## [1.0.1] - 2018-02-26

### Fixed
* Removed code for 'format on save', feature not ready.


## [1.0.0] - 2018-02-23

First version
