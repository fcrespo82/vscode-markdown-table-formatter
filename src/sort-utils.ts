import { TextEditor, TextEditorEdit } from "vscode";
import { MDTable, MDTableSortDirection } from "./MDTable";
import { getSettings } from "./table-formatter";
import { columnSizes } from "./utils";

export let sortIndicator = {
	ascending: '▲',
	descending: '▼',
	separator: ' '
};
export let cleanSortIndicator = (text: string): string => {
	return text.replace(sortIndicator.ascending, '').replace(sortIndicator.descending, '');
};
export let hasAscendingSortIndicator = (text: string): boolean => {
	return text.indexOf(sortIndicator.ascending) >= 0;
};
export let hasDescendingSortIndicator = (text: string): boolean => {
	return text.indexOf(sortIndicator.descending) >= 0;
};
export const setAscSortIndicator = (text: string) => {
	return cleanSortIndicator(text).trim() + sortIndicator.separator + sortIndicator.ascending;
};
export const setDescSortIndicator = (text: string) => {
	return cleanSortIndicator(text).trim() + sortIndicator.separator + sortIndicator.descending;
};

export let toggleSortIndicator = (text: string): string => {
	if (hasAscendingSortIndicator(text)) {
		return cleanSortIndicator(text).trim() + sortIndicator.separator + sortIndicator.descending;
	} else {
		return cleanSortIndicator(text).trim() + sortIndicator.separator + sortIndicator.ascending;
	}
};

export const sortCommand = (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => {
	let table: MDTable = args[0];
	let header: number = args[1];
	let sort: MDTableSortDirection = args[2];
	
	editor.edit(editBuilder => {
		editBuilder.replace(table.range, table.sorted(header, sort));
	});
};