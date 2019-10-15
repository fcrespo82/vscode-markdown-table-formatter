import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MarkdownTableFormatterSettings } from '../../interfaces';
import { MDTable } from '../../MDTable';
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
		removeColonsIfSameAsDefault: false
	};

	vscode.window.showInformationMessage('Starting all tests.');

	testTables.forEach((testTable, i) => {
		let testSettings: MarkdownTableFormatterSettings = testTable.settings || settings;

		let testSettingsString = `{ just=${pad(testSettings.defaultTableJustification, 6)}, pipes=${pad(String(testSettings.keepFirstAndLastPipes), 5)}, columnPading=${pad(String(testSettings.limitLastColumnPadding), 5)}, removeColons=${pad(String(testSettings.removeColonsIfSameAsDefault), 5)}, spacePadding=${testSettings.spacePadding} }`;

		test(`Should format correctly table ${pad(String(i), 2)} with ${testSettingsString}`, () => {
			let table = new MDTable(0, new vscode.Position(0, 0), new vscode.Position(0, 0), testTable.input);
			assert.equal(table.formatted(testTable.settings || settings), testTable.expected);
		});
	});
});
