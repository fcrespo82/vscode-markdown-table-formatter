import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import MarkdownTableFormatterSettings from '../../formatter/MarkdownTableFormatterSettings';
import { discoverMaxColumnSizes, discoverMaxTableSizes, pad, tablesIn } from '../../MarkdownTableUtils';
import { testTables } from '../files/tables';
import { MarkdownTableFormatterProvider, MarkdownTableFormatterGlobalColumnSizes, MarkdownTableFormatterDelimiterRowPadding } from '../../formatter/MarkdownTableFormatterProvider';

suite('Extension Test Suite', () => {

	suiteSetup(() => {
		vscode.workspace.registerTextDocumentContentProvider('test-table', testTablesProvider);
		vscode.window.showInformationMessage('Starting all tests.');
	});

	suiteTeardown(() => {
		vscode.window.showInformationMessage('Finalizing all tests.');
	});

	let settings: MarkdownTableFormatterSettings = {
		enable: true,
		spacePadding: 1,
		keepFirstAndLastPipes: true,
		defaultTableJustification: 'Left',
		markdownGrammarScopes: ['markdown'],
		limitLastColumnPadding: false,
		removeColonsIfSameAsDefault: false,
		globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
		delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None
	};

	let formatterProvider = new MarkdownTableFormatterProvider();

	testTables.forEach((testTable, i) => {
		let testSettings: MarkdownTableFormatterSettings = testTable.settings || settings;

		let testSettingsString = `{ defaultTableJustification=${pad(testSettings.defaultTableJustification, 6)}, keepFirstAndLastPipes=${pad(String(testSettings.keepFirstAndLastPipes), 5)}, limitLastColumnPadding=${pad(String(testSettings.limitLastColumnPadding), 5)}, removeColonsIfSameAsDefault=${pad(String(testSettings.removeColonsIfSameAsDefault), 5)}, spacePadding=${testSettings.spacePadding} }, globalColumnSizes=${testSettings.globalColumnSizes} }`;

		test(`Should format correctly table ${pad(String(i), 2)} with ${testSettingsString}`, () => {
			let uri = vscode.Uri.parse('test-table:' + i);
			return vscode.workspace.openTextDocument(uri).then(doc => {
				let tables = tablesIn(doc, doc.validateRange(new vscode.Range(0, 0, doc.lineCount + 1, 0)));
				if (testSettings.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameColumnSize) {
					let maxSize = discoverMaxColumnSizes(tables);
					tables.forEach(table => {
						table.columnSizes = maxSize;
					});
				} if (testSettings.globalColumnSizes === MarkdownTableFormatterGlobalColumnSizes.SameTableSize) {
					let tableSizes = discoverMaxTableSizes(tables, testSettings.spacePadding);
					tables.forEach((table, i) => {
						table.columnSizes = tableSizes[i];
					});
				}
				let formattedTables = tables.map(table => {
					return formatterProvider.formatTable(table, testTable.settings || settings);
				}).join('\n\n');
				assert.equal(formattedTables, testTable.expected);
			});
		});
	});
});

const testTablesProvider = new class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		let result = testTables[Number(uri.path)].input;
		return result;
	}
};