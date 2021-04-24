import * as vscode from 'vscode';
import MarkdownTableFormatterSettings from '../formatter/MarkdownTableFormatterSettings';
import { checkLanguage, tablesIn } from '../MarkdownTableUtils';
import { Reporter } from '../telemetry/Reporter';

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

	private config: MarkdownTableFormatterSettings

	private reporter?: Reporter

	constructor(config: MarkdownTableFormatterSettings, reporter?: Reporter) {
		this.reporter = reporter;
		this.config = config;
	}

	dispose(): void {
		this.disposables.map(d => d.dispose());
		this.disposables = [];
	}

	public register(): void {
		this.disposables.push(
			vscode.commands.registerTextEditorCommand("markdown-table-formatter.toggleDebug", this.toggleDebug, this)
		);
		this.disposables.push(
			vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this)
		);
	}

	private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
		if (!checkLanguage(event.document.languageId, this.config)) { return }
		const editor = vscode.window.activeTextEditor;
		if (editor != null) {
			this.addDecorations(editor);
		}
	}

	private createDecorations(document: vscode.TextDocument): vscode.DecorationOptions[] {
		const startDate = new Date().getTime();
		const fullDocumentRange = document.validateRange(new vscode.Range(0, 0, document.lineCount + 1, 0));
		const tables = tablesIn(document);
		const fullDecoration: vscode.DecorationOptions[] = tables.map(t => {
			return {
				range: t.range,
				hoverMessage: `ID: ${t.id}`,
				renderOptions: {}
			};
		});
		const headerDecoration: vscode.DecorationOptions[] = tables.map(t => {
			return {
				range: t.headerRange,
				renderOptions: {
					after: { contentText: ` ID: ${t.id}` }
				}
			};
		});
		const endDate = new Date().getTime();
		this.reporter?.sendTelemetryEvent("function", {
			name: "createDecorations",
			languageId: document.languageId
		}, {
			timeTakenMilliseconds: endDate - startDate
		})
		return fullDecoration.concat(headerDecoration);
	}

	private addDecorations(editor: vscode.TextEditor) {
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		this.cleanDecorations(editor);
		if (this.decorationsEnabled) {
			this.decorations = this.createDecorations(editor.document);
			editor?.setDecorations(this.decorationType, this.decorations);
		}
	}

	private cleanDecorations(editor?: vscode.TextEditor) {
		editor?.setDecorations(this.decorationType, []);
	}

	private toggleDebug(editor: vscode.TextEditor) {
		if (!checkLanguage(editor.document.languageId, this.config)) { return }
		this.decorationsEnabled = !this.decorationsEnabled;
		this.reporter?.sendTelemetryEvent("command", {
			name: "toggleDebug",
			languageId: editor.document.languageId,
			enabled: this.decorationsEnabled.toString()
		}, {})
		this.addDecorations(editor);
	}
}