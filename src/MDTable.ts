import { Position, Range } from "vscode";
import { MarkdownTableFormatterSettings } from "./interfaces";
import { addTailPipes, columnSizes, fixJustification, formatLines, joinCells, padding, splitCells, stripHeaderTailPipes, tableJustification } from "./utils";
import { cleanSortIndicator, setAscSortIndicator, setDescSortIndicator } from "./sort-utils";

export enum MDTableSortDirection {
	Asc,
	Desc
}
export class MDTable {
	private offset: number;
	private start: Position;
	private end: Position;
	readonly text: string;
	readonly header: string[] = [];
	readonly format: string[] = [];
	readonly body: string[][] = [];
	readonly range: Range;
	private _columnSizes: number[] = [];

	get columns() {
		return this.header.length;
	}

	get bodyLines() {
		return this.body.length;
	}

	get totalLines() {
		return this.bodyLines + 2;
	}

	get columnSizes() {
		return this._columnSizes;
	}
	set columnSizes(value) {
		this._columnSizes = value;
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

		this._columnSizes = columnSizes(this.header, this.body);
	}

	notFormatted = () => {
		let joined = [this.header, this.format, ...this.body].map(joinCells).map(addTailPipes);
		return joined.join('\n');
	}

	sorted = (headerIndex: number, sortDirection: MDTableSortDirection) => {
		this.header.forEach((header, i) => {
			if (i !== headerIndex) {
				this.header[i] = cleanSortIndicator(header);
			}
		});
		switch (sortDirection) {
			case MDTableSortDirection.Asc:
				this.header[headerIndex] = setAscSortIndicator(this.header[headerIndex]);
				this.columnSizes = columnSizes(this.header, this.body);
				this.body.sort((a: any, b: any) => {
					if (a[headerIndex] === b[headerIndex]) {
						return 0;
					}
					else {
						return (a[headerIndex] > b[headerIndex]) ? -1 : 1;
					}
				});
				break;
			case MDTableSortDirection.Desc:
				this.header[headerIndex] = setDescSortIndicator(this.header[headerIndex]);
				this.columnSizes = columnSizes(this.header, this.body);
				this.body.sort((a: any, b: any) => {
					if (a[headerIndex] === b[headerIndex]) {
						return 0;
					}
					else {
						return (a[headerIndex] < b[headerIndex]) ? -1 : 1;
					}
				});
				break;
		}
		return this.notFormatted();
	}

	formatted = (settings: MarkdownTableFormatterSettings) => {
		let addTailPipesIfNeeded = settings.keepFirstAndLastPipes
			? addTailPipes
			: (x: string) => x;

		let header = formatLines([this.header], this.format, this.columnSizes, settings).map(line => {
			let cellPadding = padding(settings.spacePadding);
			return line.map((cell, i) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatLine = formatLines([this.format], this.format, this.columnSizes, settings).map(line => {
			return line.map((cell, i) => {
				let [front, back] = fixJustification(cell);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(cell) === tableJustification[settings.defaultTableJustification])) {
					return padding(this.columnSizes[i] + (settings.spacePadding * 2), '-');
				}
				return front + padding(this.columnSizes[i] + (settings.spacePadding * 2) - 2, '-') + back;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let body = formatLines(this.body, this.format, this.columnSizes, settings).map(line => {
			let cellPadding = padding(settings.spacePadding);
			return line.map((cell, i) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatted = [header, formatLine, ...body];

		return formatted.join('\n');
	}
}

