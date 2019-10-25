import { Position, Range } from "vscode";
import { addTailPipes, fixJustification, formatLines, joinCells, splitCells, stripHeaderTailPipes, tableJustification } from "./formatter-utils";
import MarkdownTableFormatterSettings from "./MarkdownTableFormatterSettings";
import { cleanSortIndicator } from "./sort-utils";
import { columnSizes, padding } from "./utils";

export enum MarkdownTableSortDirection {
	Asc,
	Desc
}
export class MarkdownTable {
	private offset: number;
	private start: Position;
	private end: Position;
	readonly text: string;
	readonly header: string[] = [];
	readonly format: string[] = [];
	readonly body: string[][] = [];
	readonly defaultBody: string[][] = [];
	readonly range: Range;
	private _columnSizes: number[] = [];

	get id(): string {
		// Improve
		return (this.start.line.toString() + this.end.line.toString()).toString();
	}

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
		this.defaultBody = reversed.reverse().map((lineBody) => {
			return splitCells(stripHeaderTailPipes(lineBody));
		});

		this._columnSizes = columnSizes(this.header, this.body);
	}

	notFormatted = () => {
		let joined = [this.header, this.format, ...this.body].map(joinCells).map(addTailPipes);
		return joined.join('\n');
	}

	notFormattedDefault = () => {
		let joined = [this.header, this.format, ...this.defaultBody].map(joinCells).map(addTailPipes);
		return joined.join('\n');
	}

	sorted = (headerIndex: number, sortDirection: MarkdownTableSortDirection, settings: MarkdownTableFormatterSettings) => {
		this.header.forEach((header, i) => {
			if (i !== headerIndex) {
				this.header[i] = cleanSortIndicator(header);
			}
		});
		switch (sortDirection) {
			case MarkdownTableSortDirection.Asc:
				this.body.sort((a: any, b: any) => {
					if (a[headerIndex] === b[headerIndex]) {
						return 0;
					}
					else {
						return (a[headerIndex] < b[headerIndex]) ? -1 : 1;
					}
				});
				break;
			case MarkdownTableSortDirection.Desc:
				this.body.sort((a: any, b: any) => {
					if (a[headerIndex] === b[headerIndex]) {
						return 0;
					}
					else {
						return (a[headerIndex] > b[headerIndex]) ? -1 : 1;
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

