import { useEffect, useState } from "react";
import logo from "./logo.png";
// import Form from "@rjsf/core";
import Form from '@rjsf/antd';
import '../../themes/style.scss';
import { Button, Input, Select, Spin } from 'antd';
import { ReactComponent as IconSelect } from '../../assets/icons/code.svg';
import { ReactComponent as IconChain } from '../../assets/icons/chain.svg';
import { LoadingOutlined } from '@ant-design/icons';
import _ from "lodash";
import ReactJson from 'react-json-view';
import CosmJsFactory from "src/lib/cosmjs-factory";
import { CustomInput } from "src/components";

const antIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: "#7954FF" }} spin />
);

const { Option } = Select;

let vscode: VSCode;

const AdvancedInteraction = () => {
    const DEFAULT_CHAINMAME = window.chainStore.chainInfos[0].chainName;
    const [mnemonic, setMnemonic] = useState('');
    const [gasPrice, setGasPrice] = useState('0');
    const [gasDenom, setGasDenom] = useState(window.chainStore.chainInfos[0].feeCurrencies[0].coinMinimalDenom);
    const [chainName, setChainName] = useState(DEFAULT_CHAINMAME);
    const [contractAddr, setContractAddr] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [resultJson, setResultJson] = useState({});
    const [isInteractionLoading, setIsInteractionLoading] = useState(false);
    const [queryMessage, setQueryMessage] = useState("");
    const [executeMessage, setExecuteMessage] = useState("");

    const onQuery = async () => {
        setErrorMessage("");
        console.log("query message: ", queryMessage)
        window.chainStore.setChain(chainName);
        setIsInteractionLoading(true);
        let cosmJs = new CosmJsFactory(window.chainStore.current);
        try {
            const queryResult = await cosmJs.current.query(contractAddr, queryMessage);
            console.log("query result: ", queryResult);
            setResultJson({ data: queryResult });
        } catch (error) {
            setErrorMessage(String(error));
        }
        setIsInteractionLoading(false);
    }

    const onHandle = async () => {
        setErrorMessage("");
        window.chainStore.setChain(chainName);
        setIsInteractionLoading(true);
        let cosmJs = new CosmJsFactory(window.chainStore.current);
        try {
            const queryResult = await cosmJs.current.execute({ mnemonic, address: contractAddr, handleMsg: executeMessage, gasAmount: { amount: gasPrice, denom: gasDenom } });
            console.log("query result: ", queryResult);
            setResultJson({ data: queryResult });
        } catch (error) {
            setErrorMessage(String(error));
        }
        setIsInteractionLoading(false);
    }

    return (
        <div className="app-body">
            <div className="intro">
                Start the Wasm smart contract development journey with CosmWasm IDE by building your first contract! Choose a smart contract file and click the button 'Build CosmWasm' to build your contract. You can also interact with an existing smart contract.
            </div>
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
                <CustomInput inputHeader="Contract address" input={contractAddr} setInput={setContractAddr} placeholder="eg. orai1ars73g86y4kzajsgam5ee38npgmkq54dlzuz6w" />
                <CustomInput inputHeader="Wallet mnemonic" input={mnemonic} setInput={setMnemonic} placeholder="eg. foo bar" />
            </div>
            <div className="contract-address">
                <span>Contract Execute </span>
            </div>
            <div className="wrap-form">
                <CustomInput inputHeader="Gas price" input={gasPrice} setInput={setGasPrice} placeholder="eg. 0.0025" />
                <CustomInput inputHeader="Gas denom" input={gasDenom} setInput={setGasDenom} placeholder="eg. orai" />
                <CustomInput inputHeader="Execute message" input={executeMessage} setInput={setExecuteMessage} placeholder="eg. {}" />
            </div>
            <Button onClick={onHandle}>
                Execute
            </Button>
            <div className="app-divider" />
            <div className="contract-address">
                <span>Contract Query </span>
            </div>
            <div className="wrap-form">
                <CustomInput inputHeader="Gas denom" input={gasDenom} setInput={setGasDenom} placeholder="eg. orai" />
                <CustomInput inputHeader="Query message" input={queryMessage} setInput={setQueryMessage} placeholder="eg. {}" />
            </div>
            <Button onClick={onQuery}>
                Query
            </Button>

            {!isInteractionLoading ?
                (errorMessage && (
                    <div className="contract-address">
                        <span style={{ color: "red" }}>Error message </span>
                        <p>{errorMessage}</p>
                    </div>
                )
                ) : (
                    <div className="deploying">
                        <Spin indicator={antIcon} />
                        <span>Invoking ...</span>
                    </div>
                )
            }
            {!_.isEmpty(resultJson) && (
                <div style={{ marginTop: '10px' }}>
                    <ReactJson collapseStringsAfterLength={20} name={false} displayObjectSize={false} src={resultJson} theme={"ocean"} />
                </div>
            )}
        </div>
    );
};

export default AdvancedInteraction;
