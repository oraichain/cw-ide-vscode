import { useEffect, useState } from "react";
// import Form from "@rjsf/core";

let vscode: VSCode;

const App = () => {

  const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';

  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    try {
      vscode = acquireVsCodeApi();
      // vscode.postMessage(`from UI: ${message.action}`);
    } catch (error) {
      console.log("error in acquire vs code api: ", error);
    }

    // send message to https://cw-ide-webview.web.app/ through iframe, the real website we want to receive data from vscode
    // this client is considered a middle-man between vscode and the actual website. It exists because it is an inner html of the webview, an iframe generated by vscode, which blocks pop-up and other stuff => cannot receive Keplr pop-up.
    let frame = document.getElementById('ide');
    if (message.action === "build") {
      // console.log("message schema file: ", message.schemaFile);
      if (isIFrame(frame) && frame.contentWindow) {
        frame.contentWindow.postMessage({
          action: message.action, payload: null, schemaFile: message.schemaFile
        }, '*');
      }
    }
    else if (message.action === "deploy") {
      if (isIFrame(frame) && frame.contentWindow) {
        frame.contentWindow.postMessage({
          action: message.action, payload: message.payload, mnemonic: message.mnemonic, handleFile: message.handleFile, queryFile: message.queryFile
        }, '*');
      }
    }
  };
  useEffect(() => {
    console.log("in use effect");
    window.addEventListener("message", eventHandler);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  });

  return (
    <iframe id="ide" src={"https://cw-ide-webview.web.app/"} frameBorder="0" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, visibility: "visible" }} />
  )
};

export default App;
