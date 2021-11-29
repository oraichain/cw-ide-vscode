//@ts-nocheck
import * as vscode from "vscode";
import { execSync } from "child_process";
import { RunButton } from "./types";
import * as fs from "fs";
import * as path from "path";
import { CosmWasmViewProvider } from "./webview-provider";
import constants from "./constants";
import * as cp from 'child_process';

const getPackagePath = (relativeFile: string): string => {
  let packagePath = path.dirname(relativeFile);
  while (packagePath && packagePath !== ".") {
    if (fs.existsSync(`${packagePath}/Cargo.toml`)) break;
    packagePath = path.dirname(packagePath);
  }
  return packagePath;
};

export const getWasmFile = (packagePath: string): string => {
  return `${packagePath}/artifacts/${path
    .basename(packagePath)
    .replace(/-/g, "_")}.wasm`;
};

export const getSchemaPath = (packagePath: string): string => {
  return `${packagePath}/artifacts/schema`;
};

const disposables = [];

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
  if (!fs.existsSync(`${rootPath.path}/Cargo.toml`)) return;

  // const configuration = vscode.workspace.getConfiguration('cosmwasm');

  const buildTool = path.join(context.extensionPath, "ext-src", "optimize.sh");
  const simulateTool = "cosmwasm-simulate";

  const where = process.platform === "linux" ? "whereis" : "where";
  const simulatePath = execSync(`${where} ${simulateTool}`).toString();
  if (simulatePath.indexOf("not found") !== -1) {
    vscode.window.showWarningMessage(
      `Please run 'cargo install ${simulateTool}'`
    );
  }

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
        name: "$(vm) Deploy CosmWasm",
        color: "#ffffff",
        singleInstance: true,
      },
    ],
  };

  const commands = config.commands as RunButton[];

  if (commands.length) {
    const terminals: { [name: string]: vscode.Terminal } = {};
    commands.forEach(
      ({ cwd, command, name, color, singleInstance, id }: RunButton) => {
        const vsCommand = `extension.${id}`;
        const disposable = vscode.commands.registerCommand(vsCommand, async () => {
          const file = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.document.fileName
            : null;
          const packagePath = getPackagePath(file);
          const wasmFile = getWasmFile(packagePath);

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
              ? path.basename(vscode.window.activeTextEditor.document.fileName)
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

          let handleFile = await readFiles(getSchemaPath(packagePath), constants.HANDLE_SCHEMA);
          let queryFile = await readFiles(getSchemaPath(packagePath), constants.QUERY_SCHEMA);

          if (id === "build") {
            const actionCommand = interpolateString(command, vars);
            infoMessage("Your contract is being built ...");
            cp.exec(actionCommand, { cwd: vars.cwd }, (error, stdout, stderr) => {
              if (error) return errorMessage(stderr);
              // send post wasm body when build & schema file path
              let schemaPath = getSchemaPath(packagePath);
              let schemaFile = `${schemaPath}/init_msg.json`;
              if (!checkSchemaExist(`${schemaPath}/init_msg.json`)) {
                if (!checkSchemaExist(`${schemaPath}/instantiate_msg.json`)) return errorMessage("Cannot collect init json schema");
                else schemaFile = `${schemaPath}/instantiate_msg.json`;
              }
              provider.setActionWithPayload({
                action: id, payload: null, schemaFile: fs.readFileSync(`${schemaFile}`).toString('ascii')
              });
              infoMessage("Your contract has been successfully built!");
            });
          } else {
            //Deploy & execute case, no need to use command since already have all the wasm & schema file.
            if (!fs.existsSync(getWasmFile(packagePath))) return errorMessage("Cannot file wasm file to deploy. Must build the contract first before deploying");
            const wasmBody = fs.readFileSync(wasmFile).toString("base64");
            // get handle & query json schema
            let mnemonic = "";
            try {
              mnemonic = fs.readFileSync(`${vars.workspaceFolder}/.env`).toString('ascii');
            } catch (error) {
              errorMessage("No .env file with mnemonic stored in the current workspace folder");
            }
            provider.setActionWithPayload({ action: id, payload: wasmBody, mnemonic, handleFile, queryFile });
          }
        });

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
  let match = null;
  while ((match = re.exec(tpl))) {
    let path = match[1].split(".").reverse();
    let obj = data[path.pop()];
    while (path.length) obj = obj[path.pop()];
    tpl = tpl.replace(match[0], obj);
  }
  return tpl;
}

function checkSchemaExist(schemaPath: string): boolean {
  if (fs.existsSync(schemaPath)) return true;
}

function errorMessage(msg: string) {
  vscode.window.showErrorMessage(msg)
}

function infoMessage(msg: string) {
  vscode.window.showInformationMessage(msg)
}

/**
 * This function read a selected file from a given directory path and return its content
 * @param dirname - directory path to the file
 * @param fileName - the file name that we want to read the content
 * @returns - a promise which includes the content of the file 
 */
function readFiles(dirname: string, fileName: any): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function (err, filenames) {
      if (err) {
        reject(error);
      }
      filenames.forEach(function (filename) {
        if (filename.includes(fileName) || filename.includes(fileName.OLD_VERSION) || filename.includes(fileName.NEW_VERSION)) {
          fs.readFile(path.join(dirname, filename), 'utf-8', function (err, content) {
            if (err) {
              reject(err);
            }
            // force return here because we dont read two files
            resolve(content);
          });
        }
      });
    });
  })
}

export default init;
