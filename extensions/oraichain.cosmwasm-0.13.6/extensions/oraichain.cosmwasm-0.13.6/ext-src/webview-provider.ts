import * as vscode from "vscode";
import * as path from "path";
import * as crypto from "crypto";

/**
 * Manages react webview panels
 */
export class CosmWasmViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "cosmwasm.interactView";
  private _buildPath: vscode.Uri;
  private _isDev: boolean;
  private _view?: vscode.WebviewView;
  constructor(context: vscode.ExtensionContext) {
    this._isDev = context.extensionMode === vscode.ExtensionMode.Development;
    this._buildPath = vscode.Uri.joinPath(context.extensionUri, "build");
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._buildPath],
    };

    // Set the webview's initial html content
    this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      vscode.window.showInformationMessage(message);
    });

    // store reference
    this._view = webviewView;
  }

  public setAction(action: string) {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage(action); // can be object
    }
  }

  public setActionWithPayload(action: Object) {
    if (this._view) {
      this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
      this._view.webview.postMessage(action); // can be object
    }
  }

  private async _getBaseHtml(cspSource: string, nonce: string) {
    let base = '<base href="';
    if (this._isDev) {
      const envText = await vscode.workspace.fs.readFile(
        vscode.Uri.joinPath(this._buildPath, "..", ".env.development")
      );
      const port = envText.toString().match(/(?<=[^_]PORT=)\d+/)?.[0];
      base += `http://localhost:${port}/" />`;
    } else {
      base += `${this._buildPath.with({ scheme: "vscode-resource" })}/">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource}; img-src * data:; script-src 'nonce-${nonce}';">`;
    }

    return base;
  }

  private async _getHtmlForWebview(webview: vscode.Webview) {
    // fixed development
    const entrypoints = this._isDev
      ? [
          "./static/js/bundle.js",
          "./static/js/vendors~main.chunk.js",
          "./static/js/main.chunk.js",
        ]
      : (require(path.join(this._buildPath.path, "asset-manifest.json"))
          .entrypoints as string[]);

    // Use a nonce to whitelist which scripts can be run
    const nonce = this._isDev ? "" : crypto.randomBytes(16).toString("base64");
    let jsList = "";
    // get localhost:port from env if development
    let cssList = await this._getBaseHtml(webview.cspSource, nonce);

    for (const entrypoint of entrypoints) {
      if (entrypoint.endsWith(".css")) {
        cssList += `<link rel="stylesheet" type="text/css" href="${entrypoint}">`;
      } else if (entrypoint.endsWith(".js")) {
        jsList += `<script nonce="${nonce}" src="${entrypoint}"></script>`;
      }
    }

    webview.html = `<!DOCTYPE html>
<html lang="en">
<head>                  
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">                  
    <title>CosmWasm Interaction</title>                                    
    ${cssList}                  
</head>
<body>                  
    <div id="root"></div>                            
    ${jsList}
</body>
</html>`;
  }
}
