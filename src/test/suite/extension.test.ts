import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MarkdownTableFormatterSettings } from '../../interfaces';
import { MDTable } from '../../MDTable';
import { testTables } from '../files/tables';

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
		test(`Should format correctly table ${i}`, () => {
			let table = new MDTable(0, new vscode.Position(0, 0), new vscode.Position(0, 0), testTable.test);
			assert.equal(table.formatted(settings), testTable.expected);
		});
	});
});
