import * as vscode from 'vscode';
import init from './init';
import { CosmWasmViewProvider } from './react-panel';

export function activate(context: vscode.ExtensionContext) {
  init(context);

  const provider = new CosmWasmViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CosmWasmViewProvider.viewType,
      provider
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
