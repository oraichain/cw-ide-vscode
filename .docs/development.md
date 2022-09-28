### Run Locally

Clone the project

```bash
  git clone https://github.com/oraichain/cw-ide-vscode.git
```

Go to the project directory

```bash
  cd cw-ide-vscode
```

Install dependencies

```bash
  yarn
```

If you want to run the extension with [webview-local](https://github.com/oraichain/cw-ide-webview.git), create a file `.env.development.webview` and add the port of webview local like the following code:

```
PORT=3000
```

Open `VSCode` and select tab `Debug` in `Activity Bar` and click `RUN AND DEBUG`, the extension will load mode development and UI from localhost instead of from production.
