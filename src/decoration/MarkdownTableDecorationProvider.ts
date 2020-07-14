import * as vscode from 'vscode';
import { tablesIn } from '../MarkdownTableUtils';

export class MarkdownTableDecorationProvider implements vscode.Disposable {

	private disposables: vscode.Disposable[] = [];

	private decorationsEnabled = false;

	private decorations: vscode.DecorationOptions[] = [];

	private decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'grey',
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
		overviewRulerColor: 'grey',
		overviewRulerLane: vscode.OverviewRulerLane.Full
	});

	dispose() {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register() {
		this.disposables.push(
			vscode.commands.registerTextEditorCommand("markdown-table-formatter.toggleDebug", this.toggleDebug, this)
		);
		this.disposables.push(
			vscode.workspace.onDidChangeTextDocument((changeEvent) => {
				this.addDecorations(vscode.window.activeTextEditor!);
			}, this)
		);
	}

	private createDecorations(document: vscode.TextDocument): vscode.DecorationOptions[] {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables = tablesIn(document, fullDocumentRange);
		let fullDecoration: vscode.DecorationOptions[] = tables.map(t => {
			return {
				range: t.range,
				hoverMessage: `ID: ${t.id}`,
				renderOptions: {}
			};
		});
		let headerDecoration: vscode.DecorationOptions[] = tables.map(t => {
			return {
				range: t.headerRange,
				renderOptions: {
					after: { contentText: ` ID: ${t.id}` }
				}
			};
		});
		return fullDecoration.concat(headerDecoration);
	}

	private addDecorations(editor: vscode.TextEditor) {
		this.cleanDecorations(editor);
		if (this.decorationsEnabled) {
			this.decorations = this.createDecorations(editor.document);
			editor.setDecorations(this.decorationType, this.decorations);
		}
	}

	private cleanDecorations(editor: vscode.TextEditor) {
		editor.setDecorations(this.decorationType, []);
	}
	private toggleDebug(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		this.decorationsEnabled = !this.decorationsEnabled;
		this.addDecorations(editor);
	}
}