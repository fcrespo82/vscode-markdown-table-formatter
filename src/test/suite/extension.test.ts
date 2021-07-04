import * as assert from 'assert';
import * as vscode from 'vscode';
import { MarkdownTableFormatterProvider } from '../../formatter/MarkdownTableFormatterProvider';
import MarkdownTableFormatterSettings, { MarkdownTableFormatterDefaultTableJustification, MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes } from '../../formatter/MarkdownTableFormatterSettings';
import MarkdownTableFormatterSettingsImpl from '../../formatter/MarkdownTableFormatterSettingsImpl';
import { pad } from '../../MarkdownTableUtils';
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
		defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
		markdownGrammarScopes: ['markdown'],
		limitLastColumnWidth: false,
		removeColonsIfSameAsDefault: false,
		globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
		delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
		allowEmptyRows: true,
		telemetry: false
	};

	testTables.forEach((testTable, i) => {

		const testSettings: MarkdownTableFormatterSettings = MarkdownTableFormatterSettingsImpl.create({ ...defaultTestSettings, ...testTable.settings });

		test(`Should format correctly table ${pad(String(testTable.id), 2)} with ${testSettings}`, async () => {

			const formatterProvider = new MarkdownTableFormatterProvider(testSettings)

			const uri = vscode.Uri.parse('test-table:' + i);

			const textEditor = await vscode.window.showTextDocument(uri);
			await vscode.languages.setTextDocumentLanguage(textEditor.document, "markdown")

			const fullDocumentRange = textEditor.document.validateRange(new vscode.Range(0, 0, textEditor.document.lineCount + 1, 0));
			const textEdits = formatterProvider.formatDocument(textEditor.document, fullDocumentRange)
			const edit = new vscode.WorkspaceEdit();
			for (const textEdit of textEdits) {
				edit.replace(uri, textEdit.range, textEdit.newText);
			}
			await vscode.workspace.applyEdit(edit);
			return assert.equal(textEditor.document.getText(), testTable.expected)
		});
	});
});

const testTablesProvider = new class implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri): string {
		return testTables[Number(uri.path)].input;
	}
};