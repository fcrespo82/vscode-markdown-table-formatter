import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MDTable } from '../../MDTable';
import { MarkdownTableFormatterProvider, getSettings } from '../../table-formatter';
import { testTables } from '../files/tables';
import { MarkdownTableFormatterSettings } from '../../interfaces';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {

	let settings: MarkdownTableFormatterSettings = {
		spacePadding: 1,
		keepFirstAndLastPipes: true,
		defaultTableJustification: 'Left',
		markdownGrammarScopes: ['markdown'],
		limitLastColumnPadding: false,
		removeColonsIfSameAsDefault: false,
		trimValues: false,
	};
	vscode.window.showInformationMessage('Starting all tests.');

	test('Should format correctly', () => {
		// testTables.forEach(testTable => {
		console.log(testTables[0].test);
		let table = new MDTable(0, new vscode.Position(0, 0), new vscode.Position(0, 0), testTables[0].test);
		assert.equal(table.formatted(settings), testTables[0].expected);
		// });
	});
});
