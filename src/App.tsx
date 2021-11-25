import { useEffect, useState } from 'react';
import './App.css';
import WASM from './lib/wasm';
import logo from './logo.png';
import Form from "@rjsf/core";

let vscode: VSCode;

const App = () => {
  const [action, setAction] = useState();
  const [wasmBody, setWasmBody] = useState();
  const [label, setLabel] = useState('');
  const [chainId, setChainId] = useState('');
  const [initInput, setInitInput] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [schema, setSchema] = useState({});

  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    // console.log('event: ', event);
    // console.log('message: ', message);
    setAction(message.action);
    if (message.payload) setWasmBody(message.payload);
    if (message.mnemonic) {
      onDeploy(message.mnemonic);
    }
    try {
      vscode = acquireVsCodeApi();
      // vscode.postMessage(`from UI: ${message.action}`);
    } catch (error) {
      console.log("error in acquire vs code api: ", error);
    }
    // if message payload is build => post message back to extension to collect schema file
    if (message.action === "build") {
      console.log("message schema file: ", message.schemaFile);
      setSchema(JSON.parse(message.schemaFile));
    }
  };

  useEffect(() => {
    window.addEventListener('message', eventHandler);
    return () => {
      window.removeEventListener('message', eventHandler);
    };
  });

  const onDeploy = async (mnemonic: any) => {
    setErrorMessage('');
    console.log("mnemonic in on deploy: ", mnemonic);
    window.chainStore.setChainId(chainId);
    try {
      let address = await WASM.handleDeploy(mnemonic, wasmBody, initInput, label);
      console.log("contract address: ", address);
      setContractAddr(address);
    } catch (error) {
      setErrorMessage(JSON.stringify(error));
    }
  }

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
      <label>Please choose chain id:</label>
      <div>
        <select name="chain-id" value={chainId} onChange={event => setChainId(event.target.value)}>
          {
            window.chainStore.chainInfos.map(info =>
              <option id={info.chainId} >{info.chainId}</option>
            )}
        </select>
      </div>
      <label>Please type init input:</label>
      <div>
        <input
          value={initInput}
          onInput={(e: any) => setInitInput(e.target.value)}
        />
      </div>
      <label>Please type label: </label>
      <div>
        <input
          value={initInput}
          onInput={(e: any) => setLabel(e.target.value)}
        />
      </div>
      <div>
        {contractAddr ? <label>Contract addr: {contractAddr}</label> : ''}
      </div>
      <div>
        {errorMessage ? <label>Error: {errorMessage}</label> : ''}
      </div>
      {/* {schema ? <Form schema={schema} /> : null} */}
    </div>
  );
};

export default App;
