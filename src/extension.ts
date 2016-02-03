// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as assert from 'assert';

var gfmtable = require('gfm-table')
var util_pad = require('utils-pad-string')


//var wcwidth = require('wcwidth');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    /*
|a|b|
|-|-:|
|teste|teste|

code|描述|详细解释
:-|:-|:-
200|成功|成功
    
    */

    var commandFormat = vscode.commands.registerTextEditorCommand("markdown-table-formatter.format", (editor, edit) => {

        var regex = /((?:(?:[^\n]*?\|[^\n]*) *)?(?:\r?\n|^))((?:\| *(?::?-+:?|::) *|\|?(?: *(?::?-+:?|::) *\|)+)(?: *(?::?-+:?|::) *)? *\r?\n)((?:(?:[^\n]*?\|[^\n]*) *(?:\r?\n|$))+)/g;

        var text = editor.document.getText();

        var match;
        while (match = regex.exec(text)) {
            var startPos = editor.document.positionAt(match.index);
            var endPos = editor.document.positionAt(match.index + match[0].length);

            var range = new vscode.Range(startPos, endPos);

            var table: string = editor.document.getText(range)

            console.log(table)

            edit.replace(range, format(table));
        }

        //vscode.window.showInformationMessage('Tables formatted!');
    });

    context.subscriptions.push(commandFormat);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function _removePipes(line: string): string {
    return line.replace(/^\||\|$/g, "");
}

function _columnsLengths(table: any): number[] {
    var columnsLengths = []
    for (var i = 0; i < table.header.length; i++) {
        var headerLength = table.header[i].length;
        var lineLengths = []
        table.body.forEach(element => {
            if (element[i]) {
                lineLengths.push(element[i].length)
            }
        });
        // console.log(headerLength)
        // console.log(lineLengths)
        var lengths = lineLengths
        lengths.push(headerLength)

        columnsLengths.push(Math.max.apply(null, lengths))
    }
    return columnsLengths
}

function _repeat(chr, n) {
    var out = '';
    for (var i = 0; i < n; i++) {
        out += chr;
    }
    return out;
}

function _trimLine(line) {
    line.forEach((value, index) => {
        line[index] = value.trim()
    });
    return line
}

function _tableToArray(table: string): any {
    table = table.trim()
    var lines = table.split("\n");
    var header = _removePipes(lines[0]).split("|");
    header = _trimLine(header)
    var formatting = _removePipes(lines[1]).trim().split("|");
    formatting = _trimLine(formatting)
    
    formatting.forEach((value, index) => {
        formatting[index] = value.replace(/(:)*(-)+(:)*/g, "$1$2$3");
    });
    formatting = _trimLine(formatting)

    lines.splice(0, 2);
    var body = lines
    var newBody = [];

    body.forEach(lineArray => {
        var line = _removePipes(lineArray).split("|")
        _trimLine(line)
        _fixColumns(line, header.length)
        newBody.push(line);
    });

    console.log(header);
    console.log(formatting);
    console.log(newBody);
    return { "header": header, "formatting": formatting, "body": newBody, "lengths": function() { return _columnsLengths(this) } }
}

function _fixColumns(line, length) {
    if (line.length < length) {
        line.push("")
        _fixColumns(line, length)
    }
    return line
}

function _column(col) {
    return '|' + col.join('|') + '|';
}

function _normalize(tableArray) {
    var padding = vscode.workspace.getConfiguration("markdown-table-formatter").get<number>("padding")
    padding = 2
    var opts = { "lpad": " ", "rpad": " " }
    tableArray.formatting.forEach((value, index, formatting) => {
        tableArray.header[index] = util_pad(tableArray.header[index], tableArray.lengths()[index] + padding, opts);
        //tableArray.formatting[index] = util_pad(tableArray.formatting[index], tableArray.lengths()[index] + padding), opts;
        tableArray.body.forEach((line, row, body) => {
            body[row][index] = util_pad(body[row][index], tableArray.lengths()[index] + padding, opts);
        });
    });
    return tableArray
}

function _pad(tableArray: any) {
    tableArray.formatting.forEach((value, index, formatting) => {
        console.log(value);
        switch (value) {
            case ":-":
            case "-":
                tableArray.header[index] = util_pad(tableArray.header[index], tableArray.lengths()[index]);
                tableArray.formatting[index] = util_pad(":-", tableArray.lengths()[index], { "rpad": "-" });
                tableArray.body.forEach((line, row, body) => {
                    body[row][index] = util_pad(body[row][index], tableArray.lengths()[index]);
                });
                break;
            case "-:":
                tableArray.header[index] = util_pad(tableArray.header[index], tableArray.lengths()[index], { "lpad": " " });
                tableArray.formatting[index] = util_pad("-:", tableArray.lengths()[index], { "lpad": "-" });
                tableArray.body.forEach((line, row, body) => {
                    body[row][index] = util_pad(body[row][index], tableArray.lengths()[index], { "lpad": " " });
                });
                break;
            case ":-:":
                tableArray.header[index] = util_pad(tableArray.header[index], tableArray.lengths()[index], { "lpad": " ", "rpad": " " });
                tableArray.formatting[index] = ":" + _repeat("-", tableArray.lengths()[index] - 2) + ":";
                tableArray.body.forEach((line, row, body) => {
                    body[row][index] = util_pad(body[row][index], tableArray.lengths()[index], { "lpad": " ", "rpad": " " });
                });
                break;
            default:
                tableArray.header[index] = util_pad(tableArray.header[index], tableArray.lengths()[index]);
                tableArray.formatting[index] = util_pad(":-", tableArray.lengths()[index], { "rpad": "-" });
                tableArray.body.forEach((line, row, body) => {
                    body[row][index] = util_pad(body[row][index], tableArray.lengths()[index]);
                });
                break;
        }
    });

    tableArray.header = _column(tableArray.header)
    tableArray.formatting = _column(tableArray.formatting)

    tableArray.body.forEach((line, index) => {
        tableArray.body[index] = _column(line)
    })
    tableArray.body = tableArray.body.join("\n")

    return tableArray.header + "\n" + tableArray.formatting + "\n" + tableArray.body
}

export function format(table: string) {
    return _pad(_tableToArray(table)) + "\n"
}
