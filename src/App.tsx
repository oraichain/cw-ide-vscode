import { useEffect, useState } from "react";
// import Form from "@rjsf/core";

let vscode: VSCode;

const App = () => {
  const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === "IFRAME";

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
    let frame = document.getElementById("ide");
    if (isIFrame(frame) && frame.contentWindow) {
      if (message.action === "build") {
        frame.contentWindow.postMessage(
          {
            payload: null,
            ...message,
          },
          "*"
        );
      } else {
        frame.contentWindow.postMessage(
          {
            ...message,
          },
          "*"
        );
      }
    } else throw "IFrame IDE is not valid";
  };
  useEffect(() => {
    console.log("in use effect");
    window.addEventListener("message", eventHandler);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  });

  return <div></div>;
};

export default App;
