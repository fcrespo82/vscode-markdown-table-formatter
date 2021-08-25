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
	readonly body?: string[][] = [];
	readonly defaultBody: string[][] = [];
	readonly range: Range;
	readonly headerRange: Range;
	readonly formatRange: Range;
	private _columnSizes: number[] = [];
	private rawContainPipes = false
	private _isInList = false
	private _listIndentation: string[] = []

	get id(): string {
		return this._id;
	}

	get columns(): number {
		return this.header.length;
	}

	get bodyLines(): number {
		return this.body?.length || 0;
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

	get isInList(): boolean {
		return this._isInList;
	}

	get listIndentation(): string[] {
		return this._listIndentation;
	}

	constructor(start: Position, end: Position, regexpArray: XRegExp.ExecArray) {
		this.start = start;
		this.end = end;

		this.range = new Range(this.start, this.end);

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const groups = regexpArray.groups!

		if (groups.body) {
			this.rawContainPipes = [groups.header, groups.format, ...groups.body?.split('\n').filter(x => { return x.trim().length > 0 })].every(v => {
				return v.search("^\\s*\\|") >= 0 && v.search("\\|\\s*\\r?\\n?$") > 0;
			});
		} else {
			this.rawContainPipes = [groups.header, groups.format].every(v => {
				return v.search("^\\s*\\|") >= 0 && v.search("\\|\\s*\\r?\\n?$") > 0;
			});
		}

		this.headerRange = new Range(this.start, new Position(this.start.line, groups.header.length));

		let firstLine = this.start.line;
		if (groups.header) {
			this.header = splitCells(stripHeaderTailPipes(groups.header));
			this.header = this.header.map(x => { return x.replace('\n', '') });
			// this.header = this.header.filter(x => { return x.trim().length > 0 })
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
		this.format = this.format.map(x => { return x.replace('\n', '') });
		this.formatRange = new Range(this.start.with(this.start.line + 1), new Position(this.start.line + 1, groups.format.length));

		firstLine += 1;

		if (groups.body) {
			this.body = groups.body.replace(/^\r?\n+|\r?\n+$/g, '').split(/\r?\n/).map((lineBody: string) => {
				let result = splitCells(stripHeaderTailPipes(lineBody));
				result = result.map(x => { return x.replace('\n', '') });
				return result
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
			this._columnSizes = columnSizes(this.header, this.body);
		} else {
			this._columnSizes = columnSizes(this.header);
		}

		this._id = md5(this.startLine.toString());

		if (groups.inlist !== undefined) {
			this._isInList = true
			this._listIndentation[0] = groups.inlist
			for (let index = 1; index < this.totalLines; index++) {
				this._listIndentation.push(" ".repeat(groups.inlist.length))
			}
		} else if (groups.indentation !== undefined) {
			this._isInList = true
			for (let index = 0; index < this.totalLines; index++) {
				this._listIndentation.push(groups.indentation)
			}
		}
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
		const addTailPipesIfNeeded = this.rawContainPipes ? addTailPipes : (x: string) => x;
		let joined = [this.format, ...this.body!].map(joinCells).map(addTailPipesIfNeeded);
		if (this.header) {
			joined = [this.header, this.format, ...this.body!].map(joinCells).map(addTailPipesIfNeeded);
		}
		return joined.join('\n');
	};

}

