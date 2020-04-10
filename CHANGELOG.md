## 2.0.4

* [CHANGED] Better error message when the header and body have different column numbers #24

## 2.0.3

* [FIX] Fix bug #19 where the extension would fail to format a table with columns header and lines with 1 character

## 2.0.2

* [CHANGED] A lot of internal fixes and improvements 

## 2.0.1

* [FIX] Various bugs


## 2.0.0

* [NEW] Global column sizes - options: Disabled, Same column size, Same table size (default: Disabled)
* [NEW] Sort table by CodeLens
* [NEW] Reorder columns (Alt+Shift+Left or Right arrow)
* [CHANGED] A lot of internal fixes and improvements 
* [REMOVED] Limit Last Column Padding - If you use this feature please let me know and I'll find a way to add it back. For now, if you rely on this, keep on the older version.


## 1.4.1

* [FIX] Ignore pipe symbols between pairs of backtick #4
* [FIX] Repeat character inserted at end of table on format #6


## 1.4.0

* [NEW] Configuration to remove the colons from format line if the justification is the same as default (default: false)
* [FIX] Format tables that have no colons or dashes on the format line (e.g. |||)
* [FIX] Configuration for `defaultTableJustification` type was wrong


## 1.3.2

* [FIX] Don't treat \`\|\` (backticked pipes) as a table cell


## 1.3.1

* [NEW] Option to disable the formatter


## 1.3.0

The extensions was rewritten to take advantage of the Formatter provider VSCode offers.

* [REPLACED] Format on save
    - Now it uses the config provided by VSCode
* [REPLACED] Auto Select Entire Document
    - Now registers a formatter provider for entire document and for selection
* [FIX] Sometimes, when formatting, a line was wrongly NEWed.


## 1.2.0

* [NEW] Format on save


## 1.0.1

* [FIX] Removed code for 'format on save', feature not ready.


## 1.0.0

* First version