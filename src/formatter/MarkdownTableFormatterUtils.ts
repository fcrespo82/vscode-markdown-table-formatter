import { Range } from "vscode";
import { MarkdownTable } from "../MarkdownTable";

export const tableJustification: { [key: string]: string } = {
    Left: ':-',
    Center: '::',
    Right: '-:'
};

export const addTailPipes = (str: string): string => {
    return `|${str}|`;
};

export const joinCells = (arr: string[]): string => {
    return arr.join('|');
};

export const stripHeaderTailPipes = (line: string | undefined): string => {
    return line?.trim().replace(/(^\||\|$)/g, '') ?? "";
};

export const getColumnIndexFromRange = (table: MarkdownTable, range: Range): number => {
    let response = -1;
    table.ranges.forEach((rangeList, columnIndex) => {
        rangeList.forEach(rangeItem => {
            if (rangeItem.contains(range)) {
                response = columnIndex;
            }
        });
    });
    return response;
}

export const splitCells = (str: string): string[] => {
    const items: string[] = [];
    let buffer = "";
    for (let i = 0; i <= str.length; i++) {
        if (((str[i] === "|") && (str[i-1] !== "\\")) || i === str.length) {
            if (buffer.length >= 0) {
                items.push(buffer);
                buffer = "";
                continue;
            }
        } else {
            buffer += str[i];
        }
    }
    return items;
};

export const fixJustification = (cell: string): string => {
    const trimmed = cell.trim();
    if (trimmed === "") {
        return "--";
    }
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    return (first || ':') + (last || '-');
};