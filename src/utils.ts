import wcswidth = require('wcwidth');
import { Range, TextDocument } from 'vscode';
import { MarkdownTableFormatterSettings } from './interfaces';
import { MDTable } from './MDTable';
import { tableRegex } from './regex';
import XRegExp = require('xregexp');

export let tableJustification: { [key: string]: string } = {
	Left: ':-',
	Center: '::',
	Right: '-:'
};

export let swidth = (str: string) => {
	// zero-width Unicode characters that we should ignore for purposes of computing string "display" width
	const zwcrx = /[\u200B-\u200D\uFEFF\u00AD]/g;
	const match = str.match(zwcrx);
	return wcswidth(str) - (match ? match.length : 0);
};

export let padding = (len: number, str: string = ' ') => {
	return str.repeat(len);
};

export let addTailPipes = (str: string) => {
	return `|${str}|`;
};

export let joinCells = (arr: string[]) => {
	return arr.join('|');
};

export let stripHeaderTailPipes = (line: string | undefined): string => {
	return line!.trim().replace(/(^\||\|$)/g, '');
};

export let splitCells = (str: string) => {
	var items: string[] = [];
	var nested = false;
	var buffer: string = '';
	for (var i = 0; i <= str.length; i++) {
		if ((str[i] === '|' && !nested) || i === str.length) {
			if (buffer.length >= 0) {
				items.push(buffer);
				buffer = '';
				continue;
			}
		} else if (str[i] === '`') {
			buffer += str[i];
			if (!nested) {
				nested = true;
			} else {
				nested = false;
			}
			continue;
		} else {
			buffer += str[i];
		}
	}
	return items;
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

export let formatLine = (line: string[], format: string[], size: number[], settings: MarkdownTableFormatterSettings) => {
	line = line.map((column, index, _) => {
		let columnSize = size[index];
		let columnJustification = format[index];
		let text = justify(column, columnJustification, columnSize, settings);
		return text;
	});
	return line;
};

export let formatLines = (lines: string[][], format: string[], size: number[], settings: MarkdownTableFormatterSettings) => {
	lines = lines.map(line => {
		return formatLine(line, format, size, settings);
	});
	return lines;
};

export let justify = (text: string, justification: string, length: number, settings: MarkdownTableFormatterSettings) => {
	text = text.trim();
	length = Math.max(length - swidth(text), 0);
	let justifySwitch = fixJustification(justification);
	if (justifySwitch === "--") {
		justifySwitch = tableJustification[settings.defaultTableJustification];
	}
	switch (justifySwitch) {
		case '::':
			return padding(length / 2) + text + padding((length + 1) / 2);
		case '-:':
			return padding(length) + text;
		case ':-':
			return text + padding(length);
		default:
			throw new Error(`Unknown column justification ${justifySwitch}`);
	}
};

export let fixJustification = (cell: string) => {
	const trimmed = cell.trim();
	if (trimmed === "") {
		return "--";
	}
	const first = trimmed[0];
	const last = trimmed[trimmed.length - 1];
	const ends = (first || ':') + (last || '-');
	return ends;
};

export let sumArray = (array: number[]): number => {
	return array.reduce((p, c) => p + c);
};

export let discoverMaxColumnSizes = (tables: MDTable[]): number[] => {
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

export let discoverMaxTableSizes = (tables: MDTable[], padding: number): number[][] => {
	let tableInfo = tables.map(table => {
		return { columnSizes: table.columnSizes, columns: table.columns };
	});

	let maxTableSize = tableInfo.reduce((p, c) => {
		return sumArray(p.columnSizes) > sumArray(c.columnSizes) ? p : c;
	});

	return tableInfo.map(info => {
		let unusableCharsMax = sumArray(maxTableSize.columnSizes) + (maxTableSize.columns * padding * 2) + (maxTableSize.columns + 1);
		let unusableCharsCurrent = (info.columns * padding * 2) + (info.columns + 1);
		let unusable = (unusableCharsMax - unusableCharsCurrent);

		let quotient = Math.floor(unusable / info.columns);
		let remainder = unusable % info.columns;
		if (sumArray(info.columnSizes) !== sumArray(maxTableSize.columnSizes)) {

			let missing = info.columnSizes.map(size => {
				return quotient - size;
			});
			let adjusted = missing.map((qf, i) => {
				if (qf > 0) {
					return info.columnSizes[i] + qf;
				} else {
					return info.columnSizes[i] - qf;
				}

			});
			let rev = adjusted.reverse();
			rev[0] += remainder;
			adjusted = rev.reverse();

			info.columnSizes = adjusted;
		}
		return info;
	}).map(info => {
		return info.columnSizes;
	});
};

export let pad = (text: string, columns: number): string => {
	return (' '.repeat(columns) + text).slice(-columns);
};

export let tablesIn = (document: TextDocument, range: Range): MDTable[] => {
	var items: MDTable[] = [];

	const text = document.getText(range);
	var pos = 0, match;
	while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
		pos = match.index + match[0].length;
		let offset = document.offsetAt(range.start);
		let start = document.positionAt(offset + match.index);
		let text = match[0].replace(/^\n+|\n+$/g, '');
		let end = document.positionAt(offset + match.index + text.length);
		let table = new MDTable(offset, start, end, text);
		items.push(table);
	}
	return items;
};