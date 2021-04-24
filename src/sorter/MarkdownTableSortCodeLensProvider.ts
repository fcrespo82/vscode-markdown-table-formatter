import * as vscode from 'vscode';
import MarkdownTableFormatterSettings from '../formatter/MarkdownTableFormatterSettings';
import { MarkdownTable } from '../MarkdownTable';
import { checkLanguage, tablesIn } from '../MarkdownTableUtils';
import { Reporter } from '../telemetry/Reporter';
import MarkdownTableSortCommandArguments from './MarkdownTableSortCommandArguments';
import { MarkdownTableSortDirection } from './MarkdownTableSortDirection';
import { cleanSortIndicator, getActiveSort, getSortIndicator, setActiveSort } from './MarkdownTableSortUtils';

export class MarkdownTableSortCodeLensProvider implements vscode.CodeLensProvider, vscode.Disposable {

	private registered = false;

	private disposables: vscode.Disposable[] = [];

	private config: MarkdownTableFormatterSettings

	private reporter?: Reporter

	constructor(config: MarkdownTableFormatterSettings, reporter?: Reporter) {
		this.reporter = reporter;
		this.config = config;
	}

	dispose(): void {
		this.registered = false;
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register(): void {
		if (this.config.enableSort) {
			this.registered = true;
			this.config.markdownGrammarScopes.forEach((scope) => {
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

			let indicator = `${header.trim()}`;
			if (header.trim() === "") {
				indicator = `Column ${header_index + 1}`;
			}

			if (activeSort && activeSort.header_index === header_index) {
				indicator = `${indicator + getSortIndicator(activeSort.sort_direction)}`;
				sort_direction = activeSort.sort_direction;
			}

			return new vscode.CodeLens(table.range, {
				title: `${indicator}`,
				command: 'markdown-table-formatter.sortTable',
				arguments: [{ table: table, options: { header_index, sort_direction } }]
			});
		});
	}

	public sortTable(table: MarkdownTable, headerIndex: number, sortDirection: MarkdownTableSortDirection): string {
		const startDate = new Date().getTime();
		table.header.forEach((header, i) => {
			if (i !== headerIndex) {
				table.header[i] = cleanSortIndicator(header);
			}
		});

		const canSortByNumber = table.body.every(l => parseFloat(l[headerIndex]))

		switch (sortDirection) {
			case MarkdownTableSortDirection.Asc:
				table.body.sort((a: string[], b: string[]) => {
					if (canSortByNumber) {
						return (parseFloat(a[headerIndex]) < parseFloat(b[headerIndex])) ? -1 : 1;
					}
					else if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() < b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
			case MarkdownTableSortDirection.Desc:
				table.body.sort((a: string[], b: string[]) => {
					if (canSortByNumber) {
						return (parseFloat(a[headerIndex]) > parseFloat(b[headerIndex])) ? -1 : 1;
					}
					else if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() > b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
		}
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("function", {
			name: "markdown-table-formatter.sortTable",
			table_id: table.id
		}, {
			timeTakenMilliseconds: endDate - startDate
		})
		return table.notFormatted();
	}

	// vscode.Commands
	// vscode.Command
	private sortCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: MarkdownTableSortCommandArguments[]) {
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		const table = args[0].table;
		const index = args[0].options.header_index;
		const direction = args[0].options.sort_direction;

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

		editor.edit(editBuilder => {
			editBuilder.replace(table.range, this.sortTable(table, index, sort));
		});

	}


	// vscode.CodeLensProvider implementation
	provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		if (!checkLanguage(document.languageId, this.config)) { return [] }

		const startDate = new Date().getTime();
		const tables = tablesIn(document);

		const lenses = tables.filter(table => {
			return table.bodyLines > 1;
		}).map((table) => {
			if (table.header === undefined) {
				return [];
			}
			return this.codeLensForTable(table, document);
		});
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("provider", {
			name: "CodeLensProvider",
			method: "provideCodeLenses",
		}, {
			timeTakenMilliseconds: endDate - startDate,
			file_lineCount: document.lineCount
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
