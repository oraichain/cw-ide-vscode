import { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";

const App = () => {
  const [action, setAction] = useState();
  const [wasmBody, setWasmBody] = useState();
  const [mnemonic, setMnemonic] = useState("");
  const [initInput, setInitInput] = useState("");
  const [contractAddr, setContractAddr] = useState("");
  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    console.log("event: ", event);
    console.log("message: ", message);
    setAction(message.action);
    setWasmBody(message.payload);
    const vscode = acquireVsCodeApi();
    vscode.postMessage(`from UI: ${message.action}`);
  };

  useEffect(() => {
    window.addEventListener("message", eventHandler);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  });

  const onDeploy = async () => {
    const childKey = window.Wasm.cosmos.getChildKey(mnemonic);
    const sender = window.Wasm.cosmos.getAddress(childKey);
    const txBody = window.Wasm.getStoreMessage(wasmBody, sender, "");
    // store code;
    const res = await window.Wasm.cosmos.submit(
      childKey,
      txBody,
      "BROADCAST_MODE_BLOCK",
      0,
      20000000
    );
    console.log("res: ", res);
    // instantiate

    const codeId = res.tx_response.logs[0].events[0].attributes.find(
      (attr: any) => attr.key === "code_id"
    ).value;
    const input = Buffer.from(initInput).toString("base64");
    const txBody2 = window.Wasm.getInstantiateMessage(
      codeId,
      input,
      sender,
      "demo smart contract"
    );
    const res2 = await window.Wasm.cosmos.submit(
      childKey,
      txBody2,
      "BROADCAST_MODE_BLOCK",
      0,
      20000000
    );

    console.log(res2);

    let address = JSON.parse(res2.tx_response.raw_log)[0].events[1]
      .attributes[0].value;
    console.log("contract address: ", address);
    setContractAddr(address);
  };

  // const onExecuteKeplr = async () => {
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
      <label>Please type mnemonic:</label>
      <div>
        <input
          value={mnemonic}
          onInput={(e: any) => setMnemonic(e.target.value)}
        />
      </div>
      <label>Please type init input:</label>
      <div>
        <input
          value={initInput}
          onInput={(e: any) => setInitInput(e.target.value)}
        />
      </div>
      <button type="button" onClick={onDeploy}>
        <span>Deploy</span>
      </button>
      <div>
        {contractAddr ? <label>Contract addr: {contractAddr}</label> : ""}
      </div>
    </div>
  );
};

export default App;
