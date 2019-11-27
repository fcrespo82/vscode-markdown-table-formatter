import * as vscode from 'vscode';
import { tablesIn } from '../MarkdownTableUtils';


interface MarkdownTableDecoration {
	id: string;
	range: vscode.Range;
}

export class MarkdownTableDecorationProvider {

	public disposables: vscode.Disposable[] = [];

	private decorationsEnabled = false;

	private decorations: MarkdownTableDecoration[] = [];

	private decorationType = vscode.window.createTextEditorDecorationType({
		backgroundColor: 'grey',
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
		overviewRulerColor: 'grey',
		overviewRulerLane: vscode.OverviewRulerLane.Full,
		after: {
			backgroundColor: 'grey'
		}
	});

	dispose() {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register() {
		this.disposables.push(vscode.commands.registerTextEditorCommand("markdown-table-formatter.toggleDebug", this.toggleDebug, this));
		vscode.workspace.onDidChangeTextDocument((changeEvent) => {
			this.decorations = this.createDecorations(changeEvent.document);
		}, this);
	}

	private createDecorations(document: vscode.TextDocument): MarkdownTableDecoration[] {
		let fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		let tables = tablesIn(document, fullDocumentRange);

		return tables.map(t => {
			return { id: t.id, range: t.range };
		});
	}

	private addDecorations(editor: vscode.TextEditor) {
		editor.setDecorations(this.decorationType, []);
		this.decorations = this.createDecorations(editor.document);
		this.decorations.forEach(i => {
			editor.setDecorations(this.decorationType, [{
				range: i.range,
				renderOptions: { after: { contentText: `${i.id}` } }
			}]);
		});
	}

	private removeDecorations(editor: vscode.TextEditor) {
		editor.setDecorations(this.decorationType, []);
	}
	private toggleDebug(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
		this.decorationsEnabled = !this.decorationsEnabled;
		if (this.decorationsEnabled) {
			this.addDecorations(editor);
		} else {
			this.removeDecorations(editor);
		}
	}
}