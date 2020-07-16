import { Position, Range } from "vscode";
import { addTailPipes, joinCells, splitCells, stripHeaderTailPipes } from "./formatter/MarkdownTableFormatterUtils";
import { columnSizes } from "./MarkdownTableUtils";
import md5 = require("md5");

export interface XRegExpExecArray extends RegExpExecArray {
	groups: any;
}

export class MarkdownTable {
	private _id: string;
	private offset: number;
	private start: Position;
	private end: Position;
	readonly header!: string[];
	readonly ranges: Map<number, Range[]> = new Map();
	format: string[] = [];
	readonly body: string[][] = [];
	readonly defaultBody: string[][] = [];
	readonly range: Range;
	readonly headerRange: Range;
	private _columnSizes: number[] = [];

	get id(): string {
		// TODO: Improve
		return this._id;
	}

	get columns(): number {
		return this.body[0].length;
	}

	get bodyLines(): number {
		return this.body.length;
	}

	get totalLines(): number {
		return this.bodyLines + 2;
	}

	get columnSizes(): number[] {
		return this._columnSizes;
	}
	set columnSizes(value: number[]) {
		this._columnSizes = value;
	}

	get startLine(): number {
		return this.start.line;
	}

	constructor(offset: number, start: Position, end: Position, regexpArray: XRegExpExecArray) {
		this.offset = offset;
		this.start = start;
		this.end = end;

		this.range = new Range(this.start, this.end);

		this.headerRange = new Range(this.start, new Position(this.start.line, regexpArray.groups.header.length));

		let firstLine = this.start.line;
		if (regexpArray.groups.header) {
			this.header = splitCells(stripHeaderTailPipes(regexpArray.groups.header));
			this.header.forEach((header, index) => {
				const length = header.length;
				const start = regexpArray.groups.header.indexOf(header);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)?.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		}

		this.format = splitCells(stripHeaderTailPipes(regexpArray.groups.format));
		// this.format.forEach((format, index) => {
		// 	var length = format.length;
		// 	var start = regexpArray.groups.format.indexOf(format);
		// 	if (!this.ranges.has(index)) {
		// 		this.ranges.set(index, []);
		// 	}
		// 	this.ranges.get(index)!.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
		// });
		firstLine += 1;

		this.body = regexpArray.groups.body.replace(/^\r?\n+|\r?\n+$/g, '').split(/\r?\n/).map((lineBody: string) => {
			return splitCells(stripHeaderTailPipes(lineBody));
		});
		this.body.forEach((line: string[], line_index) => {
			line.forEach((h, index) => {
				const length = h.length;
				const start = regexpArray.groups.body.split(/\r?\n/)[line_index].indexOf(h);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)?.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		});

		if (regexpArray.groups.header) {
			this._columnSizes = columnSizes(this.header, this.body);
		} else {
			this._columnSizes = columnSizes(this.body[0], this.body);
		}

		const header = this.header.reduce((acc, val) => acc += val.trim(), "");
		// FIXME: Improve
		const body = this.body.length;//.reduce((acc, val) => acc.concat(val), []).reduce((acc, val) => acc += val.trim(), "");
		this._id = md5(header + body);
	}

	updateSizes = (): void => {
		this._columnSizes = columnSizes(this.header, this.body);
	}

	notFormatted = (): string => {
		let joined = [this.format, ...this.body].map(joinCells).map(addTailPipes);
		if (this.header) {
			joined = [this.header, this.format, ...this.body].map(joinCells).map(addTailPipes);
		}
		return joined.join('\n');
	};

	notFormattedDefault = (): string => {
		let joined = [this.format, ...this.defaultBody].map(joinCells).map(addTailPipes);
		if (this.header) {
			joined = [this.header, this.format, ...this.defaultBody].map(joinCells).map(addTailPipes);
		}
		return joined.join('\n');
	};

}

