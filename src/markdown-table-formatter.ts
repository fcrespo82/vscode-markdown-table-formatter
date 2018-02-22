// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TableFormatter } from './table-formatter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let tableFormatter = new TableFormatter();

    let commandFormat = vscode.commands.registerTextEditorCommand("markdown-table-formatter.format", (editor, edit) => {
        tableFormatter.format(editor);
        // vscode.window.showInformationMessage('Tables formatted!');
    });

    let commandEnable = vscode.commands.registerTextEditorCommand("markdown-table-formatter.enableForCurrentScope", (editor, edit) => {
        var config = vscode.workspace.getConfiguration('markdown-table-formatter');
        var scopes : [String] = config.markdownGrammarScopes;
        scopes.push(editor.document.languageId);
        config.update("markdownGrammarScopes", scopes, true);
        vscode.window.showInformationMessage(`Markdown table formatter enabled for '${editor.document.languageId}' language scope!`);
    });

    let formatOnSave = vscode.workspace.onWillSaveTextDocument((event) => {
        console.log(event.document.fileName);
        let edits: vscode.TextEdit[] = []
        
        event.waitUntil(new Promise<vscode.TextEdit[]>((resolve, reject) => {
            
            edits.push(vscode.TextEdit.insert(new vscode.Position(0,0), `${event.document.uri}`));

            resolve(edits);
        }));

        // event.waitUntil(new Promise<vscode.TextEdit[]>((resolve, reject) => {
        //     resolve(() => {
        //         vscode.window.activeTextEditor.edit((b)=>{
        //             b.insert(new vscode.Position(0,0), "Formatei");
        //     });
        // }));            
        
        // if (vscode.workspace.getConfiguration('markdown-table-formatter').get('formatOnSave')) {
            
            // let textEditors = vscode.window.visibleTextEditors.filter(te =>  {
            //     return te.document.uri === event.document.uri;
            // });

        //     textEditors.map
        //     textEditors.forEach(textEditor => {
        //         console.log(`${textEditor.document.uri}`);
        //         tableFormatter.format(textEditor, true);
        //         return textEditor.edit((b)=>{
        //             b.insert(new vscode.Position(0,0), "Formatei");
        //         });
        //     });
            

        // }
        // });
    });

    context.subscriptions.push(commandFormat);
    context.subscriptions.push(commandEnable);
    context.subscriptions.push(formatOnSave);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

export function getAllSettings() {
    return vscode.workspace.getConfiguration('markdown-table-formatter');
  }
  