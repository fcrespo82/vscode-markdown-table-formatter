import { MarkdownTableSortDirection } from "./MarkdownTableSortDirection";

export default interface MarkdownTableSortOptions {
	header_index: number;
	sort_direction: MarkdownTableSortDirection;
}