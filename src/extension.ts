// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var gfmtable = require('gfm-table')

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

            edit.replace(range, formatTable(table));

        }

        vscode.window.showInformationMessage('Tables formatted!');
    });

    context.subscriptions.push(commandFormat);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


function formatTable(myTable: string) {

    var table = [];
    var lines = myTable.trim().split("\n");
    lines.forEach(function(value) {
        var line = removePipes(value).split("|");
        line = line.map(function(value) {
            return value.trim();
        });
        table.push(line);
    });

    var header = table.splice(1, 1);
    
    var newHeader = header[0].map(function(value: string) {
        value = value.replace(/\s/g, "");
        value = value.replace(/-+/g, "-");

        switch (value) {
            case ":-":
                return "l";
            case ":-:":
                return "c";
            case "-:":
                return "r";
            default:
                return "l";
        }
    });
    
    normalizeColumns(table);
    
    return format(table, newHeader);

}

function normalizeColumns(table) {
    var max;
    
    var tableLen = table.map(function(line) {
        return line.length;
    });
    
    max = tableLen.reduce(function(prev, cur) {
        return Math.max(prev, cur);
    });
    
    table.forEach(function(value) {
        if (value.length < max) {
            value.push("");
        }
    });
}

function removePipes(line: string): string {
    return line.replace(/^\||\|$/g, "");
}

function format(rows, align) {
    align = align || [];
    var outputs = [];
    var header = rows.shift();
    var maxLengths = rows.reduce(function(res, row) {
        var sliced = row.slice(0, res.length);
        return sliced.map(function(val, i) {
            return Math.max(res[i], val.toString().length);
        });
    }, header.map(function(val) { return val.toString().length; }));

    outputs.push(header.map(function(val, i) { return ' ' + pad(val.toString(), maxLengths[i], align[i]) + ' '; }));
    outputs.push(maxLengths.map(function(n, i) {
        return (!!~'lc'.indexOf(align[i]) ? ':' : ' ') + repeat('-', n) + (!!~'rc'.indexOf(align[i]) ? ':' : ' ');
    }));
    rows.forEach(function(row) {
        var sliced = row.slice(0, header.length);
        outputs.push(sliced.map(function(val, i) { return ' ' + pad(val.toString(), maxLengths[i], align[i]) + ' '; }));
    });

    return outputs.map(column).join("\n");
};

function column(col) {
    return '|' + col.join('|') + '|';
}

function pad(str, n, align) {
    if (align === 'r') return lPad(str, n);
    if (align === 'c') {
        return rPad(lPad(str, str.length + Math.floor((n - str.length) / 2)), n);
    }
    return rPad(str, n);
}

function lPad(str, n) {
    for (var i = 0, len = n - str.length; i < len; i++) {
        str = ' ' + str;
    }
    return str;
}

function rPad(str, n) {
    for (var i = 0, len = n - str.length; i < len; i++) {
        str += ' ';
    }
    return str;
}

function repeat(chr, n) {
    var out = '';
    for (var i = 0; i < n; i++) {
        out += chr;
    }
    return out;
}