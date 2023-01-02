import * as vscode from "vscode";
import { RunButton, Version } from "./types";
import * as fs from "fs";
import * as path from "path";
import { CosmWasmViewProvider } from "./webview-provider";
import constants from "./constants";
import * as cp from "child_process";
import * as os from "os";
import _ from "lodash";
import * as toml from 'toml';

const getPackagePath = (relativeFile: string): string => {
  let packagePath = path.dirname(relativeFile);
  while (packagePath && packagePath !== ".") {
    if (fs.existsSync(`${packagePath}/Cargo.toml`)) break;
    packagePath = path.dirname(packagePath);
  }
  return packagePath;
};

const getTomlFile = (relativeFile: string): string => {
  return `${getPackagePath(relativeFile)}/Cargo.toml`;
}

export const getWasmFile = (packagePath: string): string => {
  return `${packagePath}/artifacts/${path.basename(packagePath)}.wasm`;
};

export const getSchemaPath = (packagePath: string): string => {
  const firstSchemaPath = `${packagePath}/artifacts/schema`;
  const isExist = fs.existsSync(firstSchemaPath);

  if (isExist) return firstSchemaPath;
  throw `Cannot file contract schema path in ${firstSchemaPath}`;
};

const disposables: any[] = [];

/**
 * This function initiates all the important logic of the extension
 * @param context - vscode extension context
 * @param provider - the cosmwasm webview provider.
 * @returns
 */
const init = async (
  context: vscode.ExtensionContext,
  provider: CosmWasmViewProvider
) => {
  disposables.forEach((d) => d.dispose());

  if (!vscode.workspace.workspaceFolders) {
    return vscode.window.showErrorMessage(
      "Working folder not found, open a folder an try again"
    );
  }

  const rootPath = vscode.workspace.workspaceFolders[0].uri;

  // not a cargo project
  // if (os.type().includes("Windows")) {
  //   if (
  //     !fs.existsSync(
  //       `${rootPath.path}/Cargo.toml`
  //         ?.toString()
  //         ?.replace(/\//g, "\\")
  //         ?.substring(1)
  //     )
  //   )
  //     return;
  // } else {
  //   if (!fs.existsSync(`${rootPath.path}/Cargo.toml`)) return;
  // }

  // const configuration = vscode.workspace.getConfiguration('cosmwasm');

  const buildTool = path.join(context.extensionPath, "ext-src", "optimize.sh");

  // check current development mode to notify users
  // let count = 0;

  const config = {
    commands: [
      {
        id: constants.BUILD,
        name: "$(wrench) Build CosmWasm",
        color: "#ffffff",
        singleInstance: true,
        command: `${buildTool} \${packagePath}`,
      },
      {
        id: constants.DEPLOY,
        name: "$(pass) Deploy CosmWasm",
        color: "#ffffff",
        singleInstance: true,
      },
      {
        id: constants.UPLOAD,
        name: "$(file-add) Upload CosmWasm",
        color: "#ffffff",
        singleInstance: true,
      },
      {
        id: constants.INSTANTIATE,
        name: "$(symbol-event) Instantiate CosmWasm",
        color: "#ffffff",
        singleInstance: true,
      },
      // {
      //   id: constants.DEV_MODE,
      //   name: "$(wrench) Toggle Development Mode",
      //   color: "#ffffff",
      //   singleInstance: true,
      // },
    ],
  };

  const commands = config.commands as RunButton[];

  if (commands.length) {
    const terminals: { [name: string]: vscode.Terminal } = {};
    commands.forEach(
      ({ cwd, command, name, color, singleInstance, id }: RunButton) => {
        const vsCommand = `extension.${id}`;
        const disposable = vscode.commands.registerCommand(
          vsCommand,
          async () => {
            const file = vscode.window.activeTextEditor
              ? vscode.window.activeTextEditor.document.fileName
              : '';
            const packagePath = getPackagePath(file);
            const wasmFile = getWasmFile(packagePath);
            const tomlFile = getTomlFile(file);

            const vars = {
              // - the path of the folder opened in VS Code
              workspaceFolder: rootPath.path,

              // - the name of the folder opened in VS Code without any slashes (/)
              workspaceFolderBasename: rootPath.path
                ? path.basename(rootPath.path)
                : null,

              // - the current opened file
              file,
              packagePath,
              wasmFile,

              // - the current opened file relative to workspaceFolder
              relativeFile:
                vscode.window.activeTextEditor && rootPath.path
                  ? path.relative(
                    rootPath.path,
                    vscode.window.activeTextEditor.document.fileName
                  )
                  : null,

              // - the current opened file's basename
              fileBasename: vscode.window.activeTextEditor
                ? path.basename(
                  vscode.window.activeTextEditor.document.fileName
                )
                : null,

              // - the current opened file's basename with no file extension
              fileBasenameNoExtension: vscode.window.activeTextEditor
                ? path.parse(
                  path.basename(
                    vscode.window.activeTextEditor.document.fileName
                  )
                ).name
                : null,

              // - the current opened file's dirname
              fileDirname: vscode.window.activeTextEditor
                ? path.dirname(vscode.window.activeTextEditor.document.fileName)
                : null,

              // - the current opened file's extension
              fileExtname: vscode.window.activeTextEditor
                ? path.parse(
                  path.basename(
                    vscode.window.activeTextEditor.document.fileName
                  )
                ).ext
                : null,

              // - the task runner's current working directory on startup
              cwd: cwd || rootPath.path || require("os").homedir(),

              //- the current selected line number in the active file
              lineNumber: vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.selection.active.line + 1
                : null,

              // - the current selected text in the active file
              selectedText: vscode.window.activeTextEditor
                ? vscode.window.activeTextEditor.document.getText(
                  vscode.window.activeTextEditor.selection
                )
                : null,

              // - the path to the running VS Code executable
              execPath: process.execPath,
            };

            try {
              let mnemonic = "";
              try {
                mnemonic = fs
                  .readFileSync(`${vars.workspaceFolder}/.env`)
                  .toString("ascii");
              } catch (error) {
                infoMessage(
                  "No .env file with mnemonic stored in the current workspace folder. The IDE will try to use Keplr wallet instead."
                );
              }

              const config = toml.parse(fs.readFileSync(tomlFile, 'utf-8'));
              const schemaName = config.package.name;

              if (id === constants.BUILD) {
                const actionCommand = interpolateString(command, vars);
                infoMessage("Your contract is being built ...");
                cp.exec(
                  actionCommand,
                  { cwd: vars.cwd },
                  async (error, stdout, stderr) => {
                    if (error) {
                      errorMessage(error.toString());
                      return;
                    }
                    infoMessage("Your contract has been successfully built!");

                    // has to read the schema file here because we are using exec async
                    const schemaFile = await readFiles(getSchemaPath(`${packagePath}`), schemaName);
                    provider.setActionWithPayload({
                      action: id,
                      payload: '',
                      schemaFile,
                      mnemonic
                    });
                  }
                );
              } else {
                const schemaFile = await readFiles(getSchemaPath(`${packagePath}`), schemaName);
                checkWasmFileExist(wasmFile);
                const wasmBody = fs.readFileSync(wasmFile).toString("base64")
                provider.setActionWithPayload({
                  action: id,
                  payload: wasmBody,
                  schemaFile,
                  mnemonic
                });
              }
            } catch (error) {
              return errorMessage(error.toString());
            }
          }
        );

        context.subscriptions.push(disposable);

        disposables.push(disposable);

        loadButton({
          id,
          vsCommand,
          command,
          name,
          color,
        });
      }
    );
  }
};

function loadButton({ command, name, color, vsCommand }: RunButton) {
  const runButton = vscode.window.createStatusBarItem(1, 0);
  runButton.text = name;
  runButton.color = color;
  runButton.tooltip = command;
  runButton.command = vsCommand;
  runButton.show();
  disposables.push(runButton);
}

function interpolateString(tpl: string, data: object): string {
  let re = /\$\{([^\}]+)\}/g;
  let match: RegExpMatchArray | null;
  while ((match = re.exec(tpl))) {
    let path = match[1].split(".").reverse();
    let lastValue = path.pop();
    if (lastValue) {
      let obj = data[lastValue];
      while (path.length) obj = obj[lastValue];
      tpl = tpl.replace(match[0], obj);
    }
    continue;
  }
  return tpl;
}

function errorMessage(msg: string) {
  vscode.window.showErrorMessage(msg);
}

function warningMessage(msg: string) {
  vscode.window.showWarningMessage(msg);
}

function infoMessage(msg: string) {
  vscode.window.showInformationMessage(msg);
}

function checkWasmFileExist(wasmPath: string): void {
  if (!fs.existsSync(wasmPath))
    throw `Cannot find wasm file in ${wasmPath} to deploy. Must build the contract first & put the built .wasm file in ${wasmPath} before deploying`;
  return;
}

/**
 * This function read a selected file from a given directory path and return its content
 * @param dirname - directory path to the file
 * @param fileName - the file name that we want to read the content
 * @returns - a promise which includes the content of the file
 */
function readFiles(dirname: string, fileName: string, resolveIfEmpty?: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function (err, files) {
      if (err) {
        reject(err);
      }
      files.forEach(function (file, i, array) {
        if (
          file.includes(fileName as string)
        ) {
          const buffer = fs.readFileSync(
            path.join(dirname, file),
            "utf-8");
          resolve(buffer);
        } else {
          if (i === array.length - 1) {
            if (resolveIfEmpty) resolve(null);
            reject(`Cannot find ${fileName}.json schema file in ${dirname}`)
          }
        }
      });
    });
  });
}

export default init;
