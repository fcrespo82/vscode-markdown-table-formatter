import { Position, Range, CodeLens } from "vscode";
import { addTailPipes, fixJustification, formatLines, joinCells, splitCells, stripHeaderTailPipes, tableJustification } from "./formatter-utils";
import MarkdownTableFormatterSettings from "./MarkdownTableFormatterSettings";
import { cleanSortIndicator } from "./sort-utils";
import { columnSizes, padding } from "./utils";

export enum MarkdownTableSortDirection {
	Asc,
	Desc
}

export interface XRegExpExecArray extends RegExpExecArray {
	groups: any;
}

export class MarkdownTable {
	private offset: number;
	private start: Position;
	private end: Position;
	readonly header!: string[];
	readonly ranges: Map<number, Range[]> = new Map();
	readonly format: string[] = [];
	readonly body: string[][] = [];
	readonly defaultBody: string[][] = [];
	readonly range: Range;
	private _columnSizes: number[] = [];
	
	get codeLenses(): CodeLens[] {
		return this.header.map((header, header_index) => {
			var sort = MarkdownTableSortDirection.Asc;
			var indicator = `${header.trim()}`;

			return new CodeLens(this.range, {
				title: `${indicator}`,
				command: 'sortTable',
			});
		});
	}

	get id(): string {
		// Improve
		return (this.start.line.toString() + this.end.line.toString()).toString();
	}

	get columns() {
		return this.body[0].length;
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

	constructor(offset: number, start: Position, end: Position, regexpArray: XRegExpExecArray) {
		this.offset = offset;
		this.start = start;
		this.end = end;

		this.range = new Range(this.start, this.end);

		var firstLine = this.start.line;
		if (regexpArray.groups.header) {
			this.header = splitCells(stripHeaderTailPipes(regexpArray.groups.header));
			this.header.forEach((header, index) => {
				var length = header.length;
				var start = regexpArray.groups.header.indexOf(header);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)!.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		}

		this.format = splitCells(stripHeaderTailPipes(regexpArray.groups.format));
		this.format.forEach((format, index) => {
			var length = format.length;
			var start = regexpArray.groups.format.indexOf(format);
			if (!this.ranges.has(index)) {
				this.ranges.set(index, []);
			}
			this.ranges.get(index)!.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
		});
		firstLine += 1;

		this.body = regexpArray.groups.body.replace(/^\r?\n+|\r?\n+$/g, '').split(/\r?\n/).map((lineBody: string) => {
			return splitCells(stripHeaderTailPipes(lineBody));
		});
		this.body.forEach((line: string[]) => {
			line.forEach((h, index) => {
				var length = h.length;
				var start = regexpArray.groups.body.indexOf(h);
				if (!this.ranges.has(index)) {
					this.ranges.set(index, []);
				}
				this.ranges.get(index)!.push(new Range(new Position(firstLine, start), new Position(firstLine, start + length)));
			});
			firstLine += 1;
		});

		this.defaultBody = this.body;

		if (regexpArray.groups.header) {
			this._columnSizes = columnSizes(this.header, this.body);
		} else {
			this._columnSizes = columnSizes(this.body[0], this.body);
		}
	}

	getColumnIndexFromRange(range: Range): number {
		let response = -1;
		this.ranges.forEach((rangeList, columnIndex) => {
			rangeList.forEach(rangeItem => {
				if (rangeItem.contains(range)) {
					response = columnIndex;
				}
			});
		});
		return response;
	}

	notFormatted = () => {
		let joined = [this.format, ...this.body].map(joinCells).map(addTailPipes);
		if (this.header) {
			joined = [this.header, this.format, ...this.body].map(joinCells).map(addTailPipes);
		}
		return joined.join('\n');
	}

	notFormattedDefault = () => {
		let joined = [this.format, ...this.defaultBody].map(joinCells).map(addTailPipes);
		if (this.header) {
			joined = [this.header, this.format, ...this.defaultBody].map(joinCells).map(addTailPipes);
		}
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
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() < b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
			case MarkdownTableSortDirection.Desc:
				this.body.sort((a: any, b: any) => {
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() > b[headerIndex].trim()) ? -1 : 1;
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

		let header: string[] = [];
		if (this.header) {
			header = formatLines([this.header], this.format, this.columnSizes, settings).map(line => {
				let cellPadding = padding(settings.spacePadding);
				return line.map((cell, i) => {
					return `${cellPadding}${cell}${cellPadding}`;
				});
			}).map(joinCells).map(addTailPipesIfNeeded);
		}

		let formatLine = formatLines([this.format], this.format, this.columnSizes, settings).map(line => {
			return line.map((cell, i) => {
				let line: string = "";
				let [front, back] = fixJustification(cell);
				if (settings.removeColonsIfSameAsDefault && (fixJustification(cell) === tableJustification[settings.defaultTableJustification])) {
					front = back = '-';
				}

				let spacePadding = padding(settings.spacePadding, ' ');
				switch (settings.delimiterRowPadding) {
					case 'None':
						line = front + padding(this.columnSizes[i] + (settings.spacePadding * 2) - 2, '-') + back;
						break;
					case 'Follow Space Padding':
						line = `${spacePadding}${front}${padding(this.columnSizes[i] - 2, '-')}${back}${spacePadding}`;
						break;
					case 'Single Space Always':
						line = ` ${front}${padding(this.columnSizes[i] + (settings.spacePadding * 2) - 4, '-')}${back} `;
						break;
					case 'Alignment Marker':
						let justifySwitch = fixJustification(cell);
						if (justifySwitch === "--") {
							justifySwitch = tableJustification[settings.defaultTableJustification];
						}
						switch (justifySwitch) {
							case '::':
								line = `${spacePadding}${front}${padding(this.columnSizes[i] + (settings.spacePadding * 2) - 4, '-')}${back}${spacePadding}`;
								break;
							case '-:':
								line = `${spacePadding}${front}${padding(this.columnSizes[i] + (settings.spacePadding * 2) - 3, '-')}${back}`;
								break;
							case ':-':
								line = `${front}${padding(this.columnSizes[i] + (settings.spacePadding * 2) - 3, '-')}${back}${spacePadding}`;
								break;
						}
						break;
				}

				return line;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let body = formatLines(this.body, this.format, this.columnSizes, settings).map(line => {
			let cellPadding = padding(settings.spacePadding);
			return line.map((cell, i) => {
				return `${cellPadding}${cell}${cellPadding}`;
			});
		}).map(joinCells).map(addTailPipesIfNeeded);

		let formatted = [formatLine, ...body];
		if (this.header) {
			formatted = [header, formatLine, ...body];
		}

		return formatted.join('\n');
	}
}

