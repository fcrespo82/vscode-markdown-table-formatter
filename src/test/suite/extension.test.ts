import * as assert from 'assert';
import * as vscode from 'vscode';
import { MarkdownTableFormatterProvider } from '../../formatter/MarkdownTableFormatterProvider';
import MarkdownTableFormatterSettings, { MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes } from '../../formatter/MarkdownTableFormatterSettings';
import MarkdownTableFormatterSettingsImpl from '../../formatter/MarkdownTableFormatterSettingsImpl';
import { discoverMaxColumnSizes, discoverMaxTableSizes, pad, tablesIn } from '../../MarkdownTableUtils';
import { testTables } from '../files/tables';

suite('Extension Test Suite', () => {

	suiteSetup(() => {
		vscode.workspace.registerTextDocumentContentProvider('test-table', testTablesProvider);
		vscode.window.showInformationMessage('Starting all tests.');
	});

	suiteTeardown(() => {
		vscode.window.showInformationMessage('Finalizing all tests.');
	});

	const defaultTestSettings: MarkdownTableFormatterSettings = {
		enable: true,
		enableSort: true,
		spacePadding: 1,
		keepFirstAndLastPipes: true,
		defaultTableJustification: 'Left',
		markdownGrammarScopes: ['markdown'],
		limitLastColumnWidth: false,
		removeColonsIfSameAsDefault: false,
		globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
		delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
		allowEmptyRows: true,
		telemetry: false
	};

	testTables.forEach((testTable, i) => {
		const testSettings: MarkdownTableFormatterSettings = MarkdownTableFormatterSettingsImpl.create(testTable.settings || defaultTestSettings);

		const formatterProvider = new MarkdownTableFormatterProvider(testSettings)

		test(`Should format correctly table ${pad(String(testTable.id), 2)} with ${testSettings}`, () => {
			const uri = vscode.Uri.parse('test-table:' + i);
			return vscode.workspace.openTextDocument(uri).then(doc => {
				const tables = tablesIn(doc, doc.validateRange(new vscode.Range(0, 0, doc.lineCount + 1, 0)));
				if (testSettings.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameColumnSize) {
					const maxSize = discoverMaxColumnSizes(tables);
					tables.forEach(table => {
						table.columnSizes = maxSize;
					});
				} if (testSettings.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameTableSize) {
					const tableSizes = discoverMaxTableSizes(tables, testSettings.spacePadding);
					tables.forEach((table, i) => {
						table.columnSizes = tableSizes[i];
					});
				}
				const formattedTables = tables.map(table => {
					return formatterProvider.formatTable(table, testTable.settings || defaultTestSettings);
				}).join('\n\n');
				assert.equal(formattedTables, testTable.expected);
			});
		});
	});
});

const testTablesProvider = new class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		const result = testTables[Number(uri.path)].input;
		return result;
	}
};