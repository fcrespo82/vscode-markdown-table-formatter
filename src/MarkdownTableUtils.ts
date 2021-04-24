import { Range, TextDocument, workspace } from 'vscode';
import MarkdownTableFormatterSettingsImpl from './formatter/MarkdownTableFormatterSettingsImpl';
import { MarkdownTable } from './MarkdownTable';
import { tableRegex } from './MarkdownTableRegex';
import wcswidth = require('wcwidth');
import XRegExp = require('xregexp');
import MarkdownTableFormatterSettings from './formatter/MarkdownTableFormatterSettings';

export const swidth = (str: string): number => {
	// zero-width Unicode characters that we should ignore for purposes of computing string "display" width
	const zwcrx = /[\u200B-\u200D\uFEFF\u00AD]/g;
	const match = str.match(zwcrx);
	return wcswidth(str) - (match ? match.length : 0);
};

export const padding = (len: number, str = ' '): string => {
	const r = len >= 0 ? str.repeat(len) : "";
	return r;
};

export const columnSizes = (header: string[], body: string[][]): number[] => {
	const columnSizes = [header, ...body].map((line) => {
		return line.map((column) => {
			return swidth(column.trim());
		});
	}).reduce((previous, current) => {
		return previous.map((column, index) => {
			if (column > current[index]) {
				return column;
			} else {
				return current[index];
			}
		});
	});

	// TODO: Improve settings loading
	const config = MarkdownTableFormatterSettingsImpl.shared;
	const preferredLineLength = <number>workspace.getConfiguration('editor').get('wordWrapColumn');
	const limitLastColumnWidth = config.limitLastColumnWidth
	const padding = config.spacePadding
	const keepFirstAndLast = config.keepFirstAndLastPipes
	const otherColumnsSum = columnSizes.length === 1 ? 0 : sumArray(columnSizes.slice(0, -1));
	const dividers = keepFirstAndLast ? columnSizes.length + 1 : columnSizes.length - 1
	const allPadding = columnSizes.length * 2 * padding

	if (limitLastColumnWidth && (columnSizes.reduce((x, y) => x + y) + dividers + allPadding) > preferredLineLength) {
		columnSizes[columnSizes.length - 1] = Math.max(
			preferredLineLength - (otherColumnsSum + dividers + allPadding),
			3,
		);
	}
	return columnSizes
};

export const sumArray = (array: number[]): number => {
	return array.reduce((p, c) => p + c);
};

export const discoverMaxColumnSizes = (tables: MarkdownTable[]): number[] => {
	return tables.map(table => {
		return table.columnSizes;
	}).reduce((p, c) => {
		const length = p.length > c.length ? p.length : c.length;
		const previousBigger = p.length > c.length;
		const result = p.length > c.length ? p : c;
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

export const discoverMaxTableSizes = (tables: MarkdownTable[], padding: number): number[][] => {
	const tableInfo = tables.map(table => {
		return { columnSizes: table.columnSizes, columns: table.columns };
	});

	const maxTableSize = tableInfo.reduce((p, c) => {
		return sumArray(p.columnSizes) + (p.columns * padding) > sumArray(c.columnSizes) + (c.columns * padding) ? p : c;
	});

	return tableInfo.map(info => {
		const totalCharsMaxTable = sumArray(maxTableSize.columnSizes) + (maxTableSize.columns * padding * 2) + (maxTableSize.columns + 1);
		const totalCharsCurrentTable = sumArray(info.columnSizes) + (info.columns * padding * 2) + (info.columns + 1);
		let missingAdjustment = Math.floor(totalCharsMaxTable - totalCharsCurrentTable);
		const remainder = missingAdjustment % info.columns;
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
				const rev = info.columnSizes.reverse();
				rev[0] += remainder;
				info.columnSizes = rev.reverse();
			}
		}
		return info.columnSizes;
	});
};

export const pad = (text: string, columns: number): string => {
	return (' '.repeat(columns) + text).slice(-columns);
};

export const tablesIn = (document: TextDocument, range?: Range): MarkdownTable[] => {
	if (!range) {
		range = new Range(0, 0, document.lineCount + 1, 0);
	}
	range = document.validateRange(range);
	const items: MarkdownTable[] = [];

	const text = document.getText(range);
	let pos = 0;
	let match;
	while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
		pos = match.index + match[0].length;
		const offset = document.offsetAt(range.start);
		const start = document.positionAt(offset + match.index);
		const text = match[0].replace(/^\n+|\n+$/g, '');
		const end = document.positionAt(offset + match.index + text.length);
		const table = new MarkdownTable(start, end, match);
		items.push(table);
	}
	return items;
};

/**
 * Check if a language is enabled in config.
 * @param languageId The language id to check.
 * @param config The config to check.
 */
export const checkLanguage = (languageId: string, config: MarkdownTableFormatterSettings): boolean => {
	return config.markdownGrammarScopes.includes(languageId)
}