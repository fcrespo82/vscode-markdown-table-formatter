import * as vscode from 'vscode';
import { getTable, setExtensionTables } from '../extension';
import MarkdownTableFormatterSettings from '../formatter/MarkdownTableFormatterSettings';
import { MarkdownTable } from '../MarkdownTable';
import { tablesIn, checkLanguage } from '../MarkdownTableUtils';
import { Reporter } from '../telemetry/Reporter';
import { MarkdownTableSortDirection } from './MarkdownTableSortDirection';
import MarkdownTableSortOptions from './MarkdownTableSortOptions';
import { cleanSortIndicator, sortIndicator } from './MarkdownTableSortUtils';

export class MarkdownTableSortCodeLensProvider implements vscode.CodeLensProvider, vscode.Disposable {

	private disposables: vscode.Disposable[] = [];

	private config: MarkdownTableFormatterSettings

	private reporter?: Reporter

	constructor(config: MarkdownTableFormatterSettings, reporter?: Reporter) {
		this.reporter = reporter;
		this.config = config;
	}

	dispose(): void {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register(): void {
		if (this.config.enableSort) {
			this.config.markdownGrammarScopes.forEach((scope) => {
				this.registerCodeLensForScope(scope);
			});

			this.disposables.push(
				vscode.commands.registerTextEditorCommand('sortTable', this.sortCommand, this)
			);

			this.disposables.push(
				vscode.workspace.onDidOpenTextDocument(document => {
					const fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
					setExtensionTables(tablesIn(document, fullDocumentRange));
				})
			);

			this.disposables.push(
				vscode.workspace.onDidChangeTextDocument(change => {
					const fullDocumentRange = change.document.validateRange(new vscode.Range(0, 0, change.document.lineCount + 1, 0));
					setExtensionTables(tablesIn(change.document, fullDocumentRange));
				})
			);

		}
	}

	private registerCodeLensForScope(scope: vscode.DocumentSelector) {
		this.disposables.push(vscode.languages.registerCodeLensProvider(scope, this));
	}

	public setActiveSort(document: vscode.TextDocument, table_id: string, header_index: number | undefined, sort_direction: MarkdownTableSortDirection | undefined): void {

		if (!this._activeSortPerDocumentAndTable) {
			this._activeSortPerDocumentAndTable = {};
		}
		if (!this._activeSortPerDocumentAndTable[document.uri.path]) {
			this._activeSortPerDocumentAndTable[document.uri.path] = {};
		}
		if (header_index !== undefined && header_index >= 0 && sort_direction) {
			this._activeSortPerDocumentAndTable[document.uri.path][table_id] = {
				header_index, sort_direction
			};
		} else {
			delete this._activeSortPerDocumentAndTable[document.uri.path][table_id];
		}
	}

	public getActiveSort(document: vscode.TextDocument, table_id: string): MarkdownTableSortOptions | undefined {
		if (this._activeSortPerDocumentAndTable && this._activeSortPerDocumentAndTable[document.uri.path]) {
			return this._activeSortPerDocumentAndTable[document.uri.path][table_id];
		}
		return undefined;
	}

	private _activeSortPerDocumentAndTable: { [index: string]: { [index: string]: MarkdownTableSortOptions | undefined } } = {};

	private getSortIndicator(direction: MarkdownTableSortDirection) {
		switch (direction) {
			case MarkdownTableSortDirection.Asc:
				return sortIndicator.separator + sortIndicator.ascending;
			case MarkdownTableSortDirection.Desc:
				return sortIndicator.separator + sortIndicator.descending;
			default:
				return "";
		}
	}
	private codeLensForTable(table: MarkdownTable, document: vscode.TextDocument): vscode.CodeLens[] {
		return table.header.map((header, header_index) => {

			// FIXME: Improve
			const activeSort = this.getActiveSort(document, table.id);
			let direction = undefined;

			let indicator = `${header.trim()}`;
			if (header.trim() === "") {
				indicator = `Column ${header_index + 1}`;
			}

			if (activeSort && activeSort.header_index === header_index) {
				indicator = `${indicator + this.getSortIndicator(activeSort.sort_direction)}`;
				direction = activeSort.sort_direction;
			}

			return new vscode.CodeLens(table.range, {
				title: `${indicator}`,
				command: 'sortTable',
				arguments: [table.id, header_index, direction]
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
		switch (sortDirection) {
			case MarkdownTableSortDirection.Asc:
				table.body.sort((a: string[], b: string[]) => {
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
						return 0;
					}
					else {
						return (a[headerIndex].trim() < b[headerIndex].trim()) ? -1 : 1;
					}
				});
				break;
			case MarkdownTableSortDirection.Desc:
				table.body.sort((a: string[], b: string[]) => {
					if (a[headerIndex].trim() === b[headerIndex].trim()) {
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
			name: "sortTable",
		}, {
			timeTakenMilliseconds: (endDate - startDate)
		})
		return table.notFormatted();
	}

	// vscode.Commands
	// vscode.Command
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private sortCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: any[]) {
		if (checkLanguage(editor.document.languageId, this.config)) { return }
		const id = args[0];
		const index = args[1];
		const direction = args[2];

		const table = getTable(id);
		if (table) {
			let sort = MarkdownTableSortDirection.None;
			switch (direction) {
				case MarkdownTableSortDirection.Asc:
					sort = MarkdownTableSortDirection.Desc;
					break;
				default:
					sort = MarkdownTableSortDirection.Asc;
					break;
			}
			this.setActiveSort(editor.document, id, index, sort);

			editor.edit(editBuilder => {
				editBuilder.replace(table.range, this.sortTable(table, index, sort));
			});
		}

	}

	// vscode.Command
	private resetCommand(editor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...args: string[]) {
		const id = args[0];

		const table = getTable(id);
		if (table) {
			this.setActiveSort(editor.document, id, undefined, MarkdownTableSortDirection.None);

			editor.edit(editBuilder => {
				// FIXME: Reset should do what?
				editBuilder.replace(table.range, this.sortTable(table, 0, MarkdownTableSortDirection.None));
			});
		}
	}

	// vscode.CodeLensProvider implementation
	provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
		const startDate = new Date().getTime();
		const fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		const tables: MarkdownTable[] = setExtensionTables(tablesIn(document, fullDocumentRange));

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
			"name": "CodeLensProvider",
			"method": "provideCodeLenses",
		}, {
			"timeTakenMilliseconds": (endDate - startDate)
		});
		return lenses.reduce((acc, val) => acc.concat(val), []);
	}

	resolveCodeLens(codeLens: vscode.CodeLens): vscode.ProviderResult<vscode.CodeLens> {
		return codeLens;
	}
}
