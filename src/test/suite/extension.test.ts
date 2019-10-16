import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MarkdownTableFormatterSettings } from '../../interfaces';
import { MDTable } from '../../MDTable';
import { tableRegex } from '../../regex';
import { testTables } from '../files/tables';
import XRegExp = require('xregexp');
import { setupMaster } from 'cluster';

suite('Extension Test Suite', () => {

	suiteSetup(() => {
		vscode.workspace.registerTextDocumentContentProvider('test-table', testTablesProvider);
		vscode.window.showInformationMessage('Starting all tests.');
	});

	suiteTeardown(() => {
		vscode.window.showInformationMessage('Finalizing all tests.');
	});

	let settings: MarkdownTableFormatterSettings = {
		spacePadding: 1,
		keepFirstAndLastPipes: true,
		defaultTableJustification: 'Left',
		markdownGrammarScopes: ['markdown'],
		limitLastColumnPadding: false,
		removeColonsIfSameAsDefault: false,
		globalColumnSizes: 'Same column size'
	};

	testTables.forEach((testTable, i) => {
		let testSettings: MarkdownTableFormatterSettings = testTable.settings || settings;

		let testSettingsString = `{ defaultTableJustification=${pad(testSettings.defaultTableJustification, 6)}, keepFirstAndLastPipes=${pad(String(testSettings.keepFirstAndLastPipes), 5)}, limitLastColumnPadding=${pad(String(testSettings.limitLastColumnPadding), 5)}, removeColonsIfSameAsDefault=${pad(String(testSettings.removeColonsIfSameAsDefault), 5)}, spacePadding=${testSettings.spacePadding} }, globalColumnSizes=${testSettings.globalColumnSizes} }`;

		test(`Should format correctly table ${pad(String(i), 2)} with ${testSettingsString}`, () => {
			let uri = vscode.Uri.parse('test-table:' + i);
			return vscode.workspace.openTextDocument(uri).then(doc => {
				let tables = tablesIn(doc, doc.validateRange(new vscode.Range(0, 0, doc.lineCount + 1, 0)));
				let formattedTables;
				if (testSettings.globalColumnSizes === 'Same column size') {
					let maxSize = tables.map(table => {
						return table.columnSizes;
					}).reduce((p, c) => {
						let length = p.length > c.length ? p.length : c.length;
						let previousBigger = p.length > c.length;
						let result = p.length > c.length ? p : c;
						for (let index = 0; index < length; index++) {
							if (previousBigger) {
								if (c[index] > p[index]) {
									result[index] = c[index];
								}
							} else {
								if (p[index] > c[index]) {
									result[index] = p[index];
								}
							}
						}
						return result;
					});
					formattedTables = tables.map(table => {
						table.columnSizes = maxSize;
						return table.formatted(testTable.settings || settings);
					}).join('\n\n');
				} if (testSettings.globalColumnSizes === 'Same table size') {
					let maxColumns = tables.map(table => {
						return table.columnSizes;
					}).map(sizeArray => {
						return sumArray(sizeArray);
					}).reduce((p, c) => {
						return p > c ? p : c;
					});
					let tableSizes = tables.map(table => {
						return table.columnSizes;
					}).map((sizeArray, i) => {
						if (sumArray(sizeArray) !== maxColumns) {
							return sizeArray.map(size => {
								return Math.round((size / sumArray(sizeArray)) * maxColumns) - 1;
							});
						} else {
							return sizeArray.map(size => {
								return Math.round((size / sumArray(sizeArray)) * maxColumns);
							});
						}
					});
					formattedTables = tables.map((table, i) => {
						table.columnSizes = tableSizes[i];
						return table.formatted(testTable.settings || settings);
					}).join('\n\n');

				} else {
					formattedTables = tables.map(table => {
						return table.formatted(testTable.settings || settings);
					}).join('\n\n');
				}
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

function sumArray(array: number[]): number {
	return array.reduce((p, c) => p + c);
}

function pad(text: string, columns: number): string {
	return (' '.repeat(columns) + text).slice(-columns);
}

function tablesIn(document: vscode.TextDocument, range: vscode.Range): MDTable[] {
	var items: MDTable[] = [];

	const text = document.getText(range);
	var pos = 0, match;
	while ((match = XRegExp.exec(text, tableRegex, pos, false))) {
		pos = match.index + match[0].length;
		let offset = document.offsetAt(range.start);
		let start = document.positionAt(offset + match.index);
		let text = match[0].replace(/^\n+|\n+$/g, '');
		let end = document.positionAt(offset + match.index + text.length);
		let table = new MDTable(offset, start, end, text);
		items.push(table);
	}
	return items;
}