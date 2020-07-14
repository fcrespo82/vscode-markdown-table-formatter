import * as assert from 'assert';
import * as vscode from 'vscode';
import { MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterProvider } from '../../formatter/MarkdownTableFormatterProvider';
import MarkdownTableFormatterSettings from '../../formatter/MarkdownTableFormatterSettings';
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

	const settings: MarkdownTableFormatterSettings = {
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
		telemetry: false
	};


	testTables.forEach((testTable, i) => {
		const formatterProvider = new MarkdownTableFormatterProvider()

		const testSettings: MarkdownTableFormatterSettings = testTable.settings || settings;

		const testSettingsString = `{ defaultTableJustification=${pad(testSettings.defaultTableJustification, 6)}, keepFirstAndLastPipes=${pad(String(testSettings.keepFirstAndLastPipes), 5)}, limitLastColumnWidth=${pad(String(testSettings.limitLastColumnWidth), 5)}, removeColonsIfSameAsDefault=${pad(String(testSettings.removeColonsIfSameAsDefault), 5)}, spacePadding=${testSettings.spacePadding} }, globalColumnSizes=${testSettings.globalColumnSizes} }`;

		test(`Should format correctly table ${pad(String(i), 2)} with ${testSettingsString}`, () => {
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
					return formatterProvider.formatTable(table, testTable.settings || settings);
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