import { useEffect, useState } from "react";
import Wasm from "./lib/wasm";
import logo from "./logo.png";
// import Form from "@rjsf/core";
import Form from '@rjsf/antd';
import './themes/style.scss';
import { Input, Select, Spin } from 'antd';
import { ReactComponent as IconSelect } from './assets/icons/code.svg';
import { ReactComponent as IconChain } from './assets/icons/chain.svg';
import { LoadingOutlined } from '@ant-design/icons';
import CosmJs from './lib/cosmjs';
import _ from "lodash";

const antIcon = (
  <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

const { Option } = Select;

let vscode: VSCode;

const App = () => {
  const DEFAULT_CHAINMAME = window.chainStore.chainInfos[0].chainName;

  const [initSchemaData, setInitSchemaData] = useState({});
  const [isBuilt, setIsBuilt] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [wasmBody, setWasmBody] = useState();
  const [label, setLabel] = useState('');
  const [gasPrice, setGasPrice] = useState('0');
  const [gasDenom, setGasDenom] = useState(window.chainStore.chainInfos[0].feeCurrencies[0].coinMinimalDenom);
  const [chainName, setChainName] = useState(DEFAULT_CHAINMAME);
  const [contractAddr, setContractAddr] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [initSchema, setInitSchema] = useState({});
  const [querySchema, setQuerySchema] = useState({});
  const [handleSchema, setHandleSchema] = useState({});
  // const [initSchemaData, setInitSchemaData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
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
      setIsBuilt(true);
      setIsDeployed(false);
      setErrorMessage("");
    }
    if (message.action === "deploy") {
      setHandleSchema(JSON.parse(message.handleFile));
      setQuerySchema(JSON.parse(message.queryFile));
    }
  };
  useEffect(() => {
    window.addEventListener("message", eventHandler);
    return () => {
      window.removeEventListener("message", eventHandler);
    };
  });

  const handleOnChange = ({ formData }, e) => {
    // setInitSchemaData(formData);
    console.log("Data submitted: ", formData)
  };

  const onDeploy = async (mnemonic: any, wasmBytes?: any) => {
    console.log("Instantiate data: ", initSchemaData);
    if (_.isEmpty(initSchemaData)) {
      setErrorMessage("Instantiate data is empty!");
      return;
    };
    setErrorMessage("");
    window.chainStore.setChain(chainName);
    setIsLoading(true);
    setContractAddr("");

    try {
      // let address = await Wasm.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput, label, sourceCode: '' });
      let address = await CosmJs.handleDeploy({ mnemonic, wasmBody: wasmBytes ? wasmBytes : wasmBody, initInput: initSchemaData, label, fees: { amount: gasPrice, denom: gasDenom } });
      console.log("contract address: ", address);
      setContractAddr(address);
      setIsDeployed(true);
      setIsBuilt(false);
      setInitSchema({});
      setIsLoading(false);
    } catch (error) {
      setIsDeployed(false);
      setIsLoading(false);
      setIsBuilt(true);
      setErrorMessage(String(error));
    }
  };

  const onQuery = async (data) => {
    console.log("data: ", data)
    const queryResult = await CosmJs.query(contractAddr, JSON.stringify(data));
    console.log("query result: ", queryResult);
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <h1 className="app-title">COSMWASM IDE</h1>
      </header>
      <div className="app-divider" />
      {
        isBuilt && (
          <div>
            <div className="app-body">
              <div className="chain-select">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconChain
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "5px",
                      marginBottom: "8px",
                    }}
                  />
                  <h3> Select chain name</h3>
                </div>
                <Select
                  defaultValue={DEFAULT_CHAINMAME}
                  style={{ width: 240 }}
                  suffixIcon={<IconSelect />}
                  onSelect={(value) => {
                    setChainName(value);
                    window.chainStore.setChain(value);
                    setGasDenom(window.chainStore.current.feeCurrencies[0].coinMinimalDenom);
                  }}
                >
                  {window.chainStore.chainInfos.map((info) => (
                    <Option key={info.chainName} value={info.chainName}>
                      {info.chainName}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="wrap-form">
                <span className="please-text">Please fill out the form below to deploy the contract:</span>
                <div className="input-form">
                  <h4>input label</h4>
                  <Input
                    placeholder="eg. random text"
                    value={label}
                    onInput={(e: any) => setLabel(e.target.value)}
                  />
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
            <Form
              schema={initSchema}
              onChange={handleOnChange}
              onSubmit={(data) => setInitSchemaData(data.formData)}
            />
          </div>
        )
      }
      {!isLoading ? (
        (contractAddr && (
          <div className="contract-address">
            <span>Contract address </span>
            <p>{contractAddr}</p>
          </div>
        )) ||
        (errorMessage && (
          <div className="contract-address">
            <span style={{ color: "red" }}>Error message </span>
            <p>{errorMessage}</p>
          </div>
        ))
      ) : (
        <div className="deploying">
          <Spin indicator={antIcon} />
          <span>Deploying ...</span>
        </div>
      )}
      {isDeployed && (
        <>
          {/* <Form schema={handleSchema} /> */}
          <Form schema={querySchema} onSubmit={(data) => onQuery(data.formData)} noValidate />
        </>
      )}
      {!isBuilt && !isDeployed && !isLoading && !errorMessage && (
        <div className="intro">
          Start the Wasm smart contract development journey with CosmWasm IDE by building your first contract!
        </div>
      )}
    </div>
  );
};

export default App;
