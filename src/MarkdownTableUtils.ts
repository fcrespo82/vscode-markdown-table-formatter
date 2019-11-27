import { Range, TextDocument, workspace } from 'vscode';
import { MarkdownTable, XRegExpExecArray } from './MarkdownTable';
import MarkdownTableFormatterSettings from './formatter/MarkdownTableFormatterSettings';
import { tableRegex } from './MarkdownTableRegex';
import wcswidth = require('wcwidth');
import XRegExp = require('xregexp');

export let swidth = (str: string) => {
	// zero-width Unicode characters that we should ignore for purposes of computing string "display" width
	const zwcrx = /[\u200B-\u200D\uFEFF\u00AD]/g;
	const match = str.match(zwcrx);
	return wcswidth(str) - (match ? match.length : 0);
};

export let padding = (len: number, str: string = ' ') => {
	return str.repeat(len);
};



export let columnSizes = (header: string[], body: string[][]) => {
	return [header, ...body].map((line, i, a) => {
		return line.map((column, ci, ca) => {
			return swidth(column.trim());
		});
	}).reduce((previous, current, i, a) => {
		return previous.map((column, index, a) => {
			if (column > current[index]) {
				return column;
			} else {
				return current[index];
			}
		});
	});
};



export let sumArray = (array: number[]): number => {
	return array.reduce((p, c) => p + c);
};

export let discoverMaxColumnSizes = (tables: MarkdownTable[]): number[] => {
	return tables.map(table => {
		return table.columnSizes;
	}).reduce((p, c) => {
		let length = p.length > c.length ? p.length : c.length;
		let previousBigger = p.length > c.length;
		let result = p.length > c.length ? p : c;
		for (let index = 0; index < length; index++) {
			if (previousBigger) {
				if (c[index] > p[index]) {
					result[index] = c[index];
				}
			} else {
				if (p[index] > c[index]) {
					result[index] = p[index];
				}
			}
		}
		return result;
	});
};

export let discoverMaxTableSizes = (tables: MarkdownTable[], padding: number): number[][] => {
	let tableInfo = tables.map(table => {
		return { columnSizes: table.columnSizes, columns: table.columns };
	});

	let maxTableSize = tableInfo.reduce((p, c) => {
		return sumArray(p.columnSizes) > sumArray(c.columnSizes) ? p : c;
	});

	return tableInfo.map(info => {
		let totalCharsMaxTable = sumArray(maxTableSize.columnSizes) + (maxTableSize.columns * padding * 2) + (maxTableSize.columns + 1);
		let totalCharsCurrentTable = sumArray(info.columnSizes) + (info.columns * padding * 2) + (info.columns + 1);
		let missingAdjustment = Math.floor(totalCharsMaxTable - totalCharsCurrentTable);
		let remainder = missingAdjustment % info.columns;
		if (sumArray(info.columnSizes) !== sumArray(maxTableSize.columnSizes)) {

			for (; missingAdjustment > 0;) {
				info.columnSizes.forEach((size, i) => {
					if (missingAdjustment > 0) {
						info.columnSizes[i] += 1;
					}
					missingAdjustment--;
				});
			}
			if (sumArray(info.columnSizes) + (info.columns * padding * 2) + (info.columns + 1) < totalCharsMaxTable) {
				let rev = info.columnSizes.reverse();
				rev[0] += remainder;
				info.columnSizes = rev.reverse();
			}
		}
		return info.columnSizes;
	});
};

export let pad = (text: string, columns: number): string => {
	return (' '.repeat(columns) + text).slice(-columns);
};

export let tablesIn = (document: TextDocument, range: Range): MarkdownTable[] => {
	var items: MarkdownTable[] = [];

	const text = document.getText(range);
	var pos = 0, match;
	while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
		pos = match.index + match[0].length;
		let offset = document.offsetAt(range.start);
		let start = document.positionAt(offset + match.index);
		let text = match[0].replace(/^\n+|\n+$/g, '');
		let end = document.positionAt(offset + match.index + text.length);
		let table = new MarkdownTable(offset, start, end, match as XRegExpExecArray);
		items.push(table);
	}
	return items;
};