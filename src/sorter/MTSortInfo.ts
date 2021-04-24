import MarkdownTableSortOptions from "./MarkdownTableSortOptions";

export default interface MTSortInfo {
	[propName: string]: { [propName: string]: MarkdownTableSortOptions };
}