import { useEffect, useState } from 'react';
import Wasm from './lib/wasm';
import logo from './logo.png';
import Form from "@rjsf/core";
import './themes/style.scss';
import { Input, Select, Spin } from 'antd';
import { ReactComponent as IconSelect } from './assets/icons/code.svg';
import { ReactComponent as IconChain } from './assets/icons/chain.svg';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />;

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
  const [schema, setSchema] = useState({});

  const [isLoading, setIsLoading] = useState(false);
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
    // if (message.action === "build") {
    //   console.log("message schema file: ", message.schemaFile);
    //   setSchema(JSON.parse(message.schemaFile));
    // }
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
    setIsLoading(true);
    setContractAddr('');

    try {
      let address = await Wasm.handleDeploy(mnemonic, wasmBody, initInput, label);
      console.log("contract address: ", address);
      setContractAddr(address);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconChain style={{ width: '16px', height: '16px', marginRight: '5px', marginBottom: '8px' }} />
            <h3> Select chain ID</h3>
          </div>
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
            <Input placeholder={`eg. {"minter": "ADDRESS"}`} value={initInput}
              onInput={(e: any) => setInitInput(e.target.value)} />
          </div>
          <div className="input-form">
            <h4>input label</h4>
            <Input placeholder="eg. random text" value={label}
              onInput={(e: any) => setLabel(e.target.value)} />
          </div>
        </div>
      </div>

      {!isLoading ?
        ((contractAddr &&
          <div className="contract-address">
            <span>Contract address </span>
            <p>{contractAddr}</p>
          </div>)
          ||
          (errorMessage &&
            <div className="contract-address">
              <span style={{ color: "red" }}>Error message </span>
              <p>{errorMessage}</p>
            </div>))
        :
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>Deploying ...</span>
        </div>}
      {/* {schema ? <Form schema={schema} /> : null} */}
    </div >

  );
};

export default App;
