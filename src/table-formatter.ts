import * as vscode from 'vscode';
import { regex } from './regex';
import { formatTable } from './format-table';
import XRegExp = require('xregexp');

export function getAllSettings() {
  return vscode.workspace.getConfiguration('markdown-table-formatter');
}

export class TableFormatter {
  public format(editor: vscode.TextEditor, force: boolean = false) {
    
    // let matches = XRegExp.match(editor.document.getText(), regex);

    var matches = [];
    var match = regex.exec(editor.document.getText());
    while (match !== null) {
      matches.push(match);
      match = regex.exec(editor.document.getText());
    }

    console.log(matches);
    
  }
}