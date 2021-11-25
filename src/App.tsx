import { useEffect, useState } from 'react';
import Wasm from './lib/wasm';
import logo from './logo.png';
import './themes/style.scss';
import { Input, Select, Button } from 'antd';
import { ReactComponent as IconSelect } from './assets/icons/code.svg';

const { Option } = Select;
function handleChange(value: any) {
  console.log(`selected ${value}`);
}

let vscode: VSCode;

const App = () => {
  const DEFAULT_CHAINID = window.chainStore.chainInfos[0].chainId;

  const [action, setAction] = useState();
  const [wasmBody, setWasmBody] = useState();
  const [label, setLabel] = useState('');
  const [chainId, setChainId] = useState('');
  const [initInput, setInitInput] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
      let address = await Wasm.handleDeploy(mnemonic, wasmBody, initInput, label);
      console.log("contract address: ", address);
      setContractAddr(address);
    } catch (error) {
      setErrorMessage(JSON.stringify(error));
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1 className="app-title">COSMWASM IDE</h1>
      </header>
      <div className="app-divider" />
      <div className="app-body">
        <div className="chain-select">
          <h3>Select chain ID</h3>
          <Select defaultValue={DEFAULT_CHAINID} style={{ width: 240 }} suffixIcon={<IconSelect />} onSelect={value => setChainId(value)}>
            {
              window.chainStore.chainInfos.map(info =>
                <Option key={info.chainId} value={info.chainId}>{info.chainId}</Option>
              )}
          </Select>
        </div>
        <div className="wrap-form">
          <span className="please-text">Please fill out the form below:</span>
          <div className="input-form">
            <h4>init contract</h4>
            <Input placeholder="eg. 1234" value={initInput}
              onInput={(e: any) => setInitInput(e.target.value)} />
          </div>
          <div className="input-form">
            <h4>input label</h4>
            <Input placeholder="eg. 1234" value={label}
              onInput={(e: any) => setLabel(e.target.value)} />
          </div>
          <div className="button-wrapper">
            <Button onClick={onDeploy}>
              Deploy
            </Button>
          </div>
          <div>
            {contractAddr ? <label>Contract addr: {contractAddr}</label> : ''}
          </div>
          <div>
            {errorMessage ? <label>Error: {errorMessage}</label> : ''}
          </div>
        </div>
      </div>
    </div >
  );
};

export default App;
