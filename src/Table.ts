import { Range, Position, EndOfLine } from "vscode";

export interface Table extends RegExpExecArray { }

export class MDTable {
	private offset: number;
	private start: Position;
	private end: Position;
	private text: string;
	readonly header: string[] = [];
	readonly format: string[] = [];
	readonly body: string[][] = [];
	readonly range: Range;

	get columns() {
		return this.header.length;
	}

	get bodyLines() {
		return this.body.length;
	}

	get totalLines() {
		return this.bodyLines + 2;
	}

	constructor(offset: number, start: Position, end: Position, text: string) {
		this.offset = offset;
		this.start = start;
		this.end = end;
		this.text = text.replace(/^\n+|\n+$/g, '');
		this.range = new Range(this.start, this.end);

		let lines = text.split(/\r?\n/);
		let reversed = lines.reverse();
		this.header = splitCells(stripHeaderTailPipes(reversed.pop()));
		this.format = splitCells(stripHeaderTailPipes(reversed.pop()));

		this.body = reversed.reverse().map((lineBody) => {
			return splitCells(stripHeaderTailPipes(lineBody));
		});
	}
}

const stripHeaderTailPipes = (line: string | undefined): string => {
	return line!.trim().replace(/(^\||\|$)/g, '');
};

const splitCells = (str: string) => {
	var items: string[] = [];
	var nested = false;
	var buffer: string = '';
	for (var i = 0; i <= str.length; i++) {
		if ((str[i] === '|' && !nested) || i == str.length) {
			if (buffer.length > 0) {
				items.push(buffer.trim());
				buffer = '';
				continue;
			}
		}
		else if (str[i] === '`') {
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