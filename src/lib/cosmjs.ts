import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/stargate/build'
import { Decimal } from '@cosmjs/math'
import { decode } from "base64-arraybuffer";
import { Coin } from "@cosmjs/cosmwasm-stargate/build/codec/cosmos/base/v1beta1/coin";

const collectWallet = async (mnemonic: string) => {
    const { current } = window.chainStore;
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        {
            hdPaths: [stringToPath(current.hdPath ? current.hdPath : "m/44'/118'/0'/0/0")],
            prefix: current.bech32Config.bech32PrefixAccAddr
        }
    );
    return wallet;
}

const CosmJs = {
    /**
   * a wrapper method to deploy a smart contract
   * @param mnemonic - Your wallet's mnemonic to deploy the contract
   * @param wasmBody - The bytecode of the wasm contract file
   * @param initInput - initiate message of the contract in object string (use JSON.stringtify)
   * @param label (optional) - contract label
   * @param source (optional) - contract source code
   * @param builder (optional) - contract builder version
   * @param fees - fees to deploy the contract
   * @returns - Contract address after the instantiation process
   */
    async handleDeploy(args: { mnemonic: string, wasmBody: string, initInput: any, label?: string | undefined, source?: string | undefined, builder?: string | undefined, fees: { amount: string, denom: string } }) {
        const { mnemonic, wasmBody, initInput, label, source, fees, builder } = args;
        const { current } = window.chainStore;
        // convert wasm body from base64 to bytes array
        const wasmCode = new Uint8Array(decode(wasmBody));
        try {
            const wallet = await collectWallet(mnemonic);
            const [firstAccount] = await wallet.getAccounts();
            const gasPrice = GasPrice.fromString(`${fees.amount}${fees.denom}`);
            const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(current.rpc, wallet, { gasPrice: gasPrice, prefix: current.bech32Config.bech32PrefixAccAddr });

            // upload wasm contract to get code id
            const uploadResult = await client.upload(firstAccount.address, wasmCode, { source, builder });
            console.log("upload result: ", uploadResult);

            const codeId = uploadResult.codeId;
            const input = initInput;

            // instantiate contract with input
            const instantiateResult = await client.instantiate(firstAccount.address, codeId, input, label ? label : "smart contract");
            console.log("instantiate result: ", instantiateResult);
            return instantiateResult.contractAddress;
        } catch (error) {
            console.log("error in handle deploy CosmJs: ", error);
            throw error;
        }
    },

    /**
     * A wrapper method to query state of a smart contract
     * @param address - contract address
     * @param queryMsg - input to query in JSON string
     * @returns - returns the parsed JSON document of the contract's query
     */
    async query(address: string, queryMsg: string) {
        const { current } = window.chainStore;
        try {
            const client = await cosmwasm.SigningCosmWasmClient.connect(current.rpc);
            const input = JSON.parse(queryMsg);
            return client.queryContractSmart(address, input);
        } catch (error) {
            console.log("error in query contract: ", error);
            throw error;
        }
    },

    /**
     * A wrapper method to execute a smart contract
     * @param args - an object containing essential parameters to execute contract
     * @returns - transaction hash after executing the contract
     */
    async execute(args: { mnemonic: string, address: string, handleMsg: string, memo?: string, amount?: Coin[], fees: { amount: string, denom: string } }) {
        try {
            const { mnemonic, address, handleMsg, memo, amount, fees } = args;
            const { current } = window.chainStore;
            const wallet = await collectWallet(mnemonic);
            const [firstAccount] = await wallet.getAccounts();
            const gasPrice = GasPrice.fromString(`${fees.amount}${fees.denom}`);
            const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(current.rpc, wallet, { gasPrice: gasPrice, prefix: current.bech32Config.bech32PrefixAccAddr });
            const input = JSON.parse(handleMsg);
            const result = await client.execute(firstAccount.address, address, input, memo, amount);
            return result.transactionHash;
        } catch (error) {
            console.log("error in executing contract: ", error);
            throw error;
        }
    }
};

export default CosmJs;