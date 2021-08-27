declare global {
  type VSCode = {
    postMessage(message: any): void;
    getState(): any;
    setState(state: any): void;
  };

  declare const vscode: VSCode;

  function acquireVsCodeApi(): VSCode;
}

export {};
