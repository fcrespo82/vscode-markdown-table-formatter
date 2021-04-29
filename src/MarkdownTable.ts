import { Position, Range } from "vscode";
import { addTailPipes, joinCells, splitCells, stripHeaderTailPipes } from "./formatter/MarkdownTableFormatterUtils";
import { columnSizes } from "./MarkdownTableUtils";
import { MarkdownTableSortDirection } from "./sorter/MarkdownTableSortDirection";
import MarkdownTableSortOptions from "./sorter/MarkdownTableSortOptions";
import md5 = require("md5");
import XRegExp = require('xregexp');
import { SortIndicator } from "./sorter/MTSortIndicator";

export class MarkdownTable {
	private _id: string;
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

	constructor(start: Position, end: Position, regexpArray: XRegExp.ExecArray) {
		this.start = start;
		this.end = end;

		this.range = new Range(this.start, this.end);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const groups = regexpArray.groups!

		this.headerRange = new Range(this.start, new Position(this.start.line, groups.header.length));

		let firstLine = this.start.line;
		if (groups.header) {
			this.header = splitCells(stripHeaderTailPipes(groups.header));
			this.header.forEach((header, index) => {
				const length = header.length;
				const start = groups.header.indexOf(header);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)?.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		}

		this.format = splitCells(stripHeaderTailPipes(groups.format));
		firstLine += 1;

		this.body = groups.body.replace(/^\r?\n+|\r?\n+$/g, '').split(/\r?\n/).map((lineBody: string) => {
			return splitCells(stripHeaderTailPipes(lineBody));
		});
		this.body.forEach((line: string[], line_index) => {
			line.forEach((h, index) => {
				const length = h.length;
				const start = groups.body.split(/\r?\n/)[line_index].indexOf(h);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)?.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		});

		if (groups.header) {
			this._columnSizes = columnSizes(this.header, this.body);
		} else {
			this._columnSizes = columnSizes(this.body[0], this.body);
		}

		this._id = md5(this.startLine.toString());
	}

	sortedByColumn = (): MarkdownTableSortOptions => {
		const mapped = this.header.map((v, i) => {
			let ind = MarkdownTableSortDirection.None
			ind = v.indexOf(SortIndicator.ascending) >= 0 ? MarkdownTableSortDirection.Asc : ind
			ind = v.indexOf(SortIndicator.descending) >= 0 ? MarkdownTableSortDirection.Desc : ind
			return (ind !== MarkdownTableSortDirection.None) ? { header_index: i, sort_direction: ind } : { header_index: -1, sort_direction: ind };
		})
		const filtered = mapped.filter((v) => {
			return v.header_index >= 0
		})
		return filtered[0];
	}

	updateSizes = (): void => {
		this._columnSizes = columnSizes(this.header, this.body);
	}

	notFormatted = (): string => {
		let joined = [this.format, ...this.body].map(joinCells);
		if (this.header) {
			joined = [this.header, this.format, ...this.body].map(joinCells);
		}
		return joined.join('\n');
	};

	notFormattedDefault = (): string => {
		let joined = [this.format, ...this.defaultBody].map(joinCells);
		if (this.header) {
			joined = [this.header, this.format, ...this.defaultBody].map(joinCells);
		}
		return joined.join('\n');
	};

}

