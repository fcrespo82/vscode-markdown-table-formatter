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