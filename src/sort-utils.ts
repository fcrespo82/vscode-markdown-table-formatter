import { TextEditor, TextEditorEdit } from "vscode";
import { markdownTableCodeLensProvider } from "./extension";
import { SortCommandArguments } from "./MarkdownTableCodeLensProvider";
import { getSettings } from "./utils";

export let sortIndicator = {
	ascending: '▲',
	descending: '▼',
	separator: ' '
};
export let cleanSortIndicator = (text: string): string => {
	return text.replace(sortIndicator.separator + sortIndicator.ascending, '').replace(sortIndicator.separator + sortIndicator.descending, '');
};
export let hasAscendingSortIndicator = (text: string): boolean => {
	return text.indexOf(sortIndicator.ascending) >= 0;
};
export let hasDescendingSortIndicator = (text: string): boolean => {
	return text.indexOf(sortIndicator.descending) >= 0;
};
export const setAscSortIndicator = (text: string) => {

	return cleanSortIndicator(text) + sortIndicator.separator + sortIndicator.ascending;
};
export const setDescSortIndicator = (text: string) => {
	return cleanSortIndicator(text) + sortIndicator.separator + sortIndicator.descending;
};

export let toggleSortIndicator = (text: string): string => {
	if (!hasAscendingSortIndicator(text)) {
		return cleanSortIndicator(text) + sortIndicator.separator + sortIndicator.ascending;
	} else {
		return cleanSortIndicator(text) + sortIndicator.separator + sortIndicator.descending;
	}
};

export const sortCommand = (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => {
	let sortArguments: SortCommandArguments = args[0];

	markdownTableCodeLensProvider.setActiveSort(sortArguments.document, sortArguments.table, sortArguments.options);

	editor.edit(editBuilder => {
		editBuilder.replace(sortArguments.table.range, sortArguments.table.sorted(sortArguments.options.header_index, sortArguments.options.sort_direction, getSettings()));
	});
};

export const resetCommand = (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) => {
	let sortArguments: SortCommandArguments = args[0];

	markdownTableCodeLensProvider.setActiveSort(sortArguments.document, sortArguments.table, undefined);

	editor.edit(editBuilder => {
		editBuilder.replace(sortArguments.table.range, sortArguments.table.notFormattedDefault());
	});
};