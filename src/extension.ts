import * as vscode from 'vscode';
import init from './init';

export function activate(context: vscode.ExtensionContext) {
  init(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
