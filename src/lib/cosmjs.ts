import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/cosmwasm-stargate/node_modules/@cosmjs/stargate/build'
import { Decimal } from '@cosmjs/math'
import { decode } from "base64-arraybuffer";

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
            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                mnemonic,
                {
                    hdPaths: [stringToPath(current.hdPath ? current.hdPath : "m/44'/118'/0'/0/0")],
                    prefix: current.bech32Config.bech32PrefixAccAddr
                }
            );
            const [firstAccount] = await wallet.getAccounts();
            console.log("first account: ", firstAccount);
            const gasPrice = GasPrice.fromString(`${fees.amount}${fees.denom}`);
            const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(current.rpc, wallet, { gasPrice: gasPrice, prefix: current.bech32Config.bech32PrefixAccAddr });
            console.log("ready to deploy");

            // upload wasm contract to get code id
            const uploadResult = await client.upload(firstAccount.address, wasmCode, { source, builder });
            console.log("upload result: ", uploadResult);

            const codeId = uploadResult.codeId;
            const input = JSON.parse(initInput);

            // instantiate contract with input
            const instantiateResult = await client.instantiate(firstAccount.address, codeId, input, label ? label : "smart contract");
            console.log("instantiate result: ", instantiateResult);
            return instantiateResult.contractAddress;
        } catch (error) {
            console.log("error in handle deploy CosmJs: ", error);
            throw error;
        }
    }
};

export default CosmJs;