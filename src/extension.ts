// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var gfmtable = require('gfm-table')

var wcwidth = require('wcwidth');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    var commandFormat = vscode.commands.registerTextEditorCommand("markdown-table-formatter.format", (editor, edit) => {

        var regex = /((?:(?:[^\n]*?\|[^\n]*) *)?(?:\r?\n|^))((?:\| *(?::?-+:?|::) *|\|?(?: *(?::?-+:?|::) *\|)+)(?: *(?::?-+:?|::) *)? *\r?\n)((?:(?:[^\n]*?\|[^\n]*) *(?:\r?\n|$))+)/g;

		// var text = editor.document.getText();

		// var match;
		// while (match = regex.exec(text)) {
		// 	var startPos = editor.document.positionAt(match.index);
        //     var endPos = editor.document.positionAt(match.index + match[0].length);
            
        //     var range = new vscode.Range(startPos, endPos);
            
        //     var table = editor.document.getText(range)
            
        //     edit.replace(range, formatTable(table));
            
        // }
        
        var table = "|a|\n|-|\n|b|"
        
        edit.insert(new vscode.Position(0, 0), formatTable(table))
        
        vscode.window.showInformationMessage('Tables formatted!');
    });   

    context.subscriptions.push(commandFormat);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

//var table = "|a|\n|-|\n|b|"

function formatTable(myTable) {
    var tableLines = myTable.split("\n");
    var formattingLine = tableLines.splice(1, 1);
    
    var t = [];
    tableLines.forEach((line) => {
        t.push(line.replace(/\||\|$/gm, "").split("|"));
    })

    return gfmtable(t);
}

//console.log(formatTable(table));