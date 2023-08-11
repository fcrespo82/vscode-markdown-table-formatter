import { MarkdownTable } from "../MarkdownTable";
import MarkdownTableSortOptions from "./MarkdownTableSortOptions";

export default interface MarkdownTableSortCommandArguments {
	markdownTableFormatterArguments: {
		table: MarkdownTable;
		options: MarkdownTableSortOptions
	}
}