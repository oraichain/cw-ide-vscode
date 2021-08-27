import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Manages react webview panels
 */
export class CosmWasmViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'cosmwasm.interactView';
  private _buildPath: vscode.Uri;
  private _view?: vscode.WebviewView;
  constructor(extensionUri: vscode.Uri) {
    this._buildPath = vscode.Uri.joinPath(extensionUri, 'build');
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._buildPath]
    };

    // Set the webview's initial html content
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'alert':
          vscode.window.showErrorMessage(message.text);
          return;
      }
    });

    // store reference
    this._view = webviewView;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const { entrypoints } = require(path.join(
      this._buildPath.path,
      'asset-manifest.json'
    ));
    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();
    let jsList = '';
    let cssList = '';

    for (const entrypoint of entrypoints as string[]) {
      const resource = webview.asWebviewUri(
        vscode.Uri.joinPath(this._buildPath, entrypoint)
      );
      if (entrypoint.endsWith('.css')) {
        cssList += `<link rel="stylesheet" type="text/css" href="${resource}">`;
      } else if (entrypoint.endsWith('.js')) {
        jsList += `<script nonce="${nonce}" src="${resource}"></script>`;
      }
    }

    return `<!DOCTYPE html>
              <html lang="en">
              <head>                  
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">                  
                  <title>CosmWasm Interaction</title>
                  ${cssList}
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src * data:; script-src 'nonce-${nonce}';">
              </head>
              <body>                  
                  <div id="root"></div>          
                  <h1>Hello</h1>        
                  ${jsList}
              </body>
              </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
