import * as vscode from "vscode";
import * as path from "path";
import * as crypto from "crypto";

export default class CosmWasmWebViewPanel {
    private _buildPath: vscode.Uri;
    private _isDev: boolean;
    public webview: vscode.WebviewPanel;

    constructor(context: vscode.ExtensionContext) {
        this._isDev = context.extensionMode === vscode.ExtensionMode.Development;
        this._buildPath = vscode.Uri.joinPath(context.extensionUri, "build");

        // init webview panel
        let webviewPanel: vscode.WebviewPanel | undefined = undefined;
        webviewPanel = vscode.window.createWebviewPanel(
            'cosmwasm-ide',
            'CosmWasm IDE',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        webviewPanel.onDidDispose(
            () => {
                webviewPanel = undefined;
            },
            undefined,
            context.subscriptions
        );

        this.webview = webviewPanel;
        this._getHtmlForWebview();
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

    private async _getHtmlForWebview() {
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
        let cssList = await this._getBaseHtml(this.webview.webview.cspSource, nonce);

        for (const entrypoint of entrypoints) {
            if (entrypoint.endsWith(".css")) {
                cssList += `<link rel="stylesheet" type="text/css" href="${entrypoint}">`;
            } else if (entrypoint.endsWith(".js")) {
                jsList += `<script nonce="${nonce}" src="${entrypoint}"></script>`;
            }
        }

        this.webview.webview.html = `<!DOCTYPE html>
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