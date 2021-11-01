import { useEffect, useState } from 'react';
import './App.css';

import logo from './logo.png';

let vscode: VSCode;

const App = () => {
  const [action, setAction] = useState();
  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    console.log('message: ', message);
    setAction(message);
    if (!vscode) {
      vscode = acquireVsCodeApi();
    }
    vscode.postMessage(`from UI: ${message}`);
  };

  useEffect(() => {
    window.addEventListener('message', eventHandler);
    return () => {
      window.addEventListener('message', eventHandler);
    };
  });

  // const onExecute = async () => {
  //   const keplr = await window.Keplr.getKeplr();
  //   if (keplr) {
  //     const { cosmos } = window.Wasm;
  //     // login
  //     await window.Keplr.suggestOraichain();
  //     const key = await keplr.getKey(cosmos.chainId);
  //     const sender = key.bech32Address;
  //     // demo ping
  //     const contract = "orai16u62y4dagpwz4su5yjzeq2v70ndq263rfn60au";
  //     const input = Buffer.from(JSON.stringify({
  //       add_ping: {}
  //     }));
  //     const txBody = window.Wasm.getHandleMessage(contract, input, sender, undefined, undefined);
  //     const { account_number, sequence } = (await cosmos.get(`/cosmos/auth/v1beta1/accounts/${sender}`)).account;
  //     const res = window.Keplr.handleKeplr(sender, txBody, key.pubKey, { accountNumber: account_number, sequence, gas: 2000000, fees: 0 });
  //     console.log("response: ", res);
  //     return res;
  //   } else {
  //     throw "You must install Keplr to continue signing this transaction";
  //   }
  // }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to CosmWasm IDE</h1>
      </header>
      <p className="App-intro">
        Action called: <br />
        <code className="ellipsis">{action}</code>
      </p>
      <button type="button" onClick={() => {}}>
        <span>Execute ping test</span>
      </button>
    </div>
  );
};

export default App;
