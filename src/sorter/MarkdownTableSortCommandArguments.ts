import { TextDocument } from "vscode";
import { MarkdownTable } from "../MarkdownTable";
import MarkdownTableSortOptions from "./MarkdownTableSortOptions";

export default interface MarkdownTableSortCommandArguments {
	table: MarkdownTable;
	options: MarkdownTableSortOptions;
	document: TextDocument;
}