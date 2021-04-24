import * as vscode from 'vscode';
import { MarkdownTableSortDirection } from "./MarkdownTableSortDirection";
import MarkdownTableSortOptions from "./MarkdownTableSortOptions";
import { SortIndicator } from './MTSortIndicator';
import MTSortInfo from './MTSortInfo';

export const cleanSortIndicator = (text: string): string => {
	const replace = ' '.repeat((SortIndicator.separator + SortIndicator.ascending).length)
	return text.replace(SortIndicator.separator + SortIndicator.ascending, replace).replace(SortIndicator.separator + SortIndicator.descending, replace);
};
const hasAscendingSortIndicator = (text: string): boolean => {
	return text.indexOf(SortIndicator.ascending) >= 0;
};
const hasDescendingSortIndicator = (text: string): boolean => {
	return text.indexOf(SortIndicator.descending) >= 0;
};
const hasAnyIndicator = (text: string): boolean => {
	return hasAscendingSortIndicator(text) || hasDescendingSortIndicator(text);
};

export const setSortIndicator = (text: string, direction: MarkdownTableSortDirection): string => {
	let indicator = ''
	let oldIndicator = ''
	if (direction === MarkdownTableSortDirection.Asc) {
		indicator = SortIndicator.ascending;
		oldIndicator = SortIndicator.descending
	}
	if (direction === MarkdownTableSortDirection.Desc) {
		indicator = SortIndicator.descending;
		oldIndicator = SortIndicator.ascending
	}
	if (hasAnyIndicator(text)) {
		text = text.replace(oldIndicator, indicator);
	} else {
		const size = Math.max(0, text.length - text.trimEnd().length - (SortIndicator.separator + indicator).length)
		text = text.trimEnd() + SortIndicator.separator + indicator + ' '.repeat(size)
	}
	return text;
};

const _activeSort: MTSortInfo = {};

export function setActiveSort(document: vscode.TextDocument, table_id: string, header_index: number | undefined, sort_direction: MarkdownTableSortDirection): void {
	if (!_activeSort[document.uri.path]) {
		_activeSort[document.uri.path] = {};
	}
	if (header_index !== undefined && header_index >= 0 && sort_direction) {
		_activeSort[document.uri.path][table_id] = {
			header_index, sort_direction
		};
	} else {
		delete _activeSort[document.uri.path][table_id];
	}
}

export function getActiveSort(document: vscode.TextDocument, table_id: string): MarkdownTableSortOptions | undefined {
	if (_activeSort && _activeSort[document.uri.path]) {
		return _activeSort[document.uri.path][table_id];
	}
	return undefined;
}

export function getSortIndicator(direction: MarkdownTableSortDirection): string {
	switch (direction) {
		case MarkdownTableSortDirection.Asc:
			return SortIndicator.separator + SortIndicator.ascending;
		case MarkdownTableSortDirection.Desc:
			return SortIndicator.separator + SortIndicator.descending;
		default:
			return "";
	}
}