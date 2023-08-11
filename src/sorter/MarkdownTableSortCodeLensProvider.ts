import * as vscode from 'vscode';
import MarkdownTableFormatterSettings from '../formatter/MarkdownTableFormatterSettings';
import {MarkdownTable} from '../MarkdownTable';
import {checkLanguage, tablesIn} from '../MarkdownTableUtils';
import MarkdownTableSortCommandArguments from './MarkdownTableSortCommandArguments';
import {MarkdownTableSortDirection} from './MarkdownTableSortDirection';
import {cleanSortIndicator, getActiveSort, getSortIndicator, setActiveSort} from './MarkdownTableSortUtils';

export class MarkdownTableSortCodeLensProvider implements vscode.CodeLensProvider, vscode.Disposable {

	private registered = false;

	private disposables: vscode.Disposable[] = [];

	private config: MarkdownTableFormatterSettings

	constructor(config: MarkdownTableFormatterSettings) {
		this.config = config;
	}

	dispose(): void {
		this.registered = false;
		this.disposables.forEach(d => d.dispose());
		this.disposables = [];
	}

	public register(): void {
		if (this.config.enableSort) {
			this.registered = true;
			this.config.markdownGrammarScopes?.forEach((scope) => {
				this.registerCodeLensForScope(scope);
			});

			this.disposables.push(
				vscode.commands.registerTextEditorCommand('markdown-table-formatter.sortTable', this.sortCommand, this)
			);
		}
	}

	private registerCodeLensForScope(scope: vscode.DocumentSelector) {
		this.disposables.push(vscode.languages.registerCodeLensProvider(scope, this));
	}

	private codeLensForTable(table: MarkdownTable, document: vscode.TextDocument): vscode.CodeLens[] {
		return table.header.map((header, header_index) => {

			const activeSort = getActiveSort(document, table.id);
			let sort_direction = MarkdownTableSortDirection.None;

			let headerText = `${header.trim()}`;
			if (header.trim() === "") {
				headerText = `Column ${header_index + 1}`;
			}

			if (activeSort && activeSort.header_index === header_index) {
				headerText = `${headerText + getSortIndicator(activeSort.sort_direction)}`;
				sort_direction = activeSort.sort_direction;
			}

			return new vscode.CodeLens(table.range, {
				title: headerText,
				command: 'markdown-table-formatter.sortTable',
				arguments: [{ table: table, options: { header_index, sort_direction } }]
			});
		});
	}

	public sortTable(table: MarkdownTable, headerIndex: number, sortDirection: MarkdownTableSortDirection): string {
		table.header.forEach((header, i) => {
			if (i !== headerIndex) {
				table.header[i] = cleanSortIndicator(header);
			}
		});

		const isIPV4 = table.body?.every(l => /\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}$/.test(l[headerIndex].trim()) || l[headerIndex].trim()==="" )

		const canSortByNumber = table.body?.every(l => /^-?\d+$/.test(l[headerIndex].trim()))

		const collator = new Intl.Collator(undefined, {
			numeric: canSortByNumber || isIPV4,
			sensitivity: this.config.sortCaseInsensitive ? "base" : "variant",
			ignorePunctuation: isIPV4
		})

		table.body?.sort((a: string[], b: string[]) => {
			let textA = a[headerIndex].trim() || "";
			let textB = b[headerIndex].trim() || "";

			let invert = sortDirection === MarkdownTableSortDirection.Desc ? -1 : 1

			const compareResult = collator.compare(textA, textB)

			return invert * compareResult;

		});

		return table.notFormatted();
	}

	// vscode.Commands
	// vscode.Command
	private sortCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: MarkdownTableSortCommandArguments) {
		if (!checkLanguage(editor.document.languageId, this.config)) { return }

		const table = args.table;
		const index = args.options.header_index;
		const direction = args.options.sort_direction;

		let sort = MarkdownTableSortDirection.None;
		switch (direction) {
			case MarkdownTableSortDirection.Asc:
				sort = MarkdownTableSortDirection.Desc;
				break;
			default:
				sort = MarkdownTableSortDirection.Asc;
				break;
		}

		setActiveSort(editor.document, table.id, index, sort);
		
		edit.replace(table.range, this.sortTable(table, index, sort));
	}

	// vscode.CodeLensProvider implementation
	provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		if (!checkLanguage(document.languageId, this.config)) { return [] }

		const tables = tablesIn(document);

		const lenses = tables
			.filter(table => table.bodyLines > 1)
			.map(table => this.codeLensForTable(table, document) ?? []);

		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
