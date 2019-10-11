import { Position, Range } from "vscode";
import { MarkdownTableFormatterSettings } from "./interfaces";
import { addTailPipes, columnSizes, fixJustification, formatLines, joinCells, padding, splitCells, stripHeaderTailPipes, tableJustification } from "./utils";

export class MDTable {
	private offset: number;
	private start: Position;
	private end: Position;
	readonly text: string;
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

	get columnSizes() {
		return columnSizes(this.header, this.body);
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

	formatted = (settings: MarkdownTableFormatterSettings) => {
		const addTailPipesIfNeeded = settings.keepFirstAndLastPipes
			? addTailPipes
			: (x: string) => x;

		let header = formatLines([this.header], this.format, columnSizes(this.header, this.body), settings).map(line => {
			const cellPadding = padding(settings.spacePadding);
			return line.map(cell => {
				// if (settings.trimValues) {
				// 	cell = cell.trim();
				// }
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatLine = formatLines([this.format], this.format, columnSizes(this.header, this.body), settings).map(line => {
			return line.map((item, i) => {
				const [front, back] = fixJustification(item);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(item) === tableJustification[settings.defaultTableJustification])) {
					return padding(columnSizes(this.header, this.body)[i], '-');
				}
				return front + padding(columnSizes(this.header, this.body)[i], '-') + back;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let body = formatLines(this.body, this.format, columnSizes(this.header, this.body), settings).map(line => {
			const cellPadding = padding(settings.spacePadding);
			return line.map(cell => {
				// if (settings.trimValues) {
				// 	cell = cell.trim();
				// }
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatted = [header, formatLine, ...body];

		return formatted.join('\n');
	}
}

