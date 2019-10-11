import wcswidth = require('wcwidth');
import { MarkdownTableFormatterSettings } from './interfaces';

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
			if (buffer.length > 0) {
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