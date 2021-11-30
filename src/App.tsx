import { useEffect, useState } from 'react';
import Wasm from './lib/wasm';
import logo from './logo.png';
import Form from "@rjsf/core";
import './themes/style.scss';
import { Input, Select, Spin } from 'antd';
import { ReactComponent as IconSelect } from './assets/icons/code.svg';
import { ReactComponent as IconChain } from './assets/icons/chain.svg';
import { LoadingOutlined } from '@ant-design/icons';
import CosmJs from './lib/cosmjs';

const antIcon = <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />;

const { Option } = Select;

let vscode: VSCode;

const App = () => {
  const DEFAULT_CHAINMAME = window.chainStore.chainInfos[0].chainName;

  const [action, setAction] = useState();
  const [wasmBody, setWasmBody] = useState();
  const [label, setLabel] = useState('');
  const [gasPrice, setGasPrice] = useState('0');
  const [gasDenom, setGasDenom] = useState(window.chainStore.chainInfos[0].feeCurrencies[0].coinMinimalDenom);
  const [chainName, setChainName] = useState(DEFAULT_CHAINMAME);
  const [initInput, setInitInput] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [initSchema, setInitSchema] = useState({});
  const [querySchema, setQuerySchema] = useState({});
  const [handleSchema, setHandleSchema] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    // console.log('event: ', event);
    // console.log('message: ', message);
    setAction(message.action);
    if (message.payload) setWasmBody(message.payload);
    if (message.mnemonic) {
      onDeploy(message.mnemonic, message.payload);
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
      setInitSchema(JSON.parse(message.schemaFile));
      setHandleSchema({});
      setQuerySchema({});
    }
    if (message.action === "deploy") {
      setInitSchema({});
      setHandleSchema(JSON.parse(message.handleFile));
      setQuerySchema(JSON.parse(message.queryFile));
    }
  };
  useEffect(() => {
    window.addEventListener('message', eventHandler);
    return () => {
      window.removeEventListener('message', eventHandler);
    };
  });

  const onDeploy = async (mnemonic: any, wasmBytes?: any) => {
    setErrorMessage('');
    console.log("mnemonic in on deploy: ", mnemonic);
    console.log("chain name: ", chainName);
    window.chainStore.setChain(chainName);
    setIsLoading(true);
    setContractAddr('');

    try {
      // let address = await Wasm.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, sourceCode: '' });
      let address = await CosmJs.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, fees: { amount: gasPrice, denom: gasDenom } });
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
            <h3> Select chain name</h3>
          </div>
          <Select defaultValue={DEFAULT_CHAINMAME} style={{ width: 240 }} suffixIcon={<IconSelect />} onSelect={value => {
            setChainName(value);
            window.chainStore.setChain(value);
          }}>
            {
              window.chainStore.chainInfos.map(info =>
                <Option key={info.chainName} value={info.chainName}>{info.chainName}</Option>
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
          <div className="input-form">
            <h4>Gas price</h4>
            <Input placeholder="eg. 0.0025" value={gasPrice}
              onInput={(e: any) => setGasPrice(e.target.value)} />
          </div>
          <div className="input-form">
            <h4>Gas denom</h4>
            <Input placeholder="eg. orai" value={gasDenom}
              onInput={(e: any) => setGasDenom(e.target.value)} />
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
      {initSchema ? <Form schema={initSchema} /> : <div />}
      {handleSchema ? <Form schema={handleSchema} /> : <div />}
      {querySchema ? <Form schema={querySchema} /> : <div />}
    </div >

  );
};

export default App;
