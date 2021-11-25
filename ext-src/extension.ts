import * as vscode from 'vscode';
import init from './init';
import { CosmWasmViewProvider } from './webview-provider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new CosmWasmViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CosmWasmViewProvider.viewType,
      provider
    )
  );

  init(context, provider);
}

// this method is called when your extension is deactivated
export function deactivate() { }
