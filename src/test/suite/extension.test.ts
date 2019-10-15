import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import XRegExp = require('xregexp');
import { MarkdownTableFormatterSettings } from '../../interfaces';
import { MDTable } from '../../MDTable';
import { tableRegex } from '../../regex';
import { testTables } from '../files/tables';


function pad(text: string, columns: number): string {
	return (' '.repeat(columns) + text).slice(-columns);
}

suite('Extension Test Suite', () => {

	let settings: MarkdownTableFormatterSettings = {
		spacePadding: 1,
		keepFirstAndLastPipes: true,
		defaultTableJustification: 'Left',
		markdownGrammarScopes: ['markdown'],
		limitLastColumnPadding: false,
		removeColonsIfSameAsDefault: false,
		globalColumnSizes: false
	};

	vscode.window.showInformationMessage('Starting all tests.');

	testTables.forEach((testTable, i) => {
		let testSettings: MarkdownTableFormatterSettings = testTable.settings || settings;

		let testSettingsString = `{ defaultTableJustification=${pad(testSettings.defaultTableJustification, 6)}, keepFirstAndLastPipes=${pad(String(testSettings.keepFirstAndLastPipes), 5)}, limitLastColumnPadding=${pad(String(testSettings.limitLastColumnPadding), 5)}, removeColonsIfSameAsDefault=${pad(String(testSettings.removeColonsIfSameAsDefault), 5)}, spacePadding=${testSettings.spacePadding} }, globalColumnSizes=${testSettings.globalColumnSizes} }`;

		test(`Should format correctly table ${pad(String(i), 2)} with ${testSettingsString}`, () => {

			let uri = vscode.Uri.parse('test-table:' + i);
			return vscode.workspace.openTextDocument(uri).then(doc => {
				let tables = tablesIn(doc, doc.validateRange(new vscode.Range(0, 0, doc.lineCount + 1, 0)));
				let formattedTables;
				if (testSettings.globalColumnSizes) {
					let maxSize = tables.map(table => {
						return table.columnSizes;
					}).reduce((p, c) => {
						let length = p.length > c.length ? p.length : c.length;
						for (let index = 0; index < length; index++) {
							if (p[index] > c[index]) {
								c[index] = p[index];
							}
						}
						return c;
					});
					formattedTables = tables.map(table => {
						table.columnSizes = maxSize;
						return table.formatted(testTable.settings || settings);
					}).join('\n\n');
				} else {
					formattedTables = tables.map(table => {
						return table.formatted(testTable.settings || settings);
					}).join('\n\n');
				}

				assert.equal(formattedTables, testTable.expected);
			});


			// let table = new MDTable(0, new vscode.Position(0, 0), new vscode.Position(0, 0), testTable.input);

		});
	});
});


const myProvider = new class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		let result = testTables[Number(uri.path)].input;
		return result;
	}
};

vscode.workspace.registerTextDocumentContentProvider('test-table', myProvider);

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