import { computed, makeObservable, observable, action } from 'mobx';

import { ChainStore as BaseChainStore } from '@keplr-wallet/stores';

import { ChainInfo } from '@keplr-wallet/types';
import Cosmos from '@oraichain/cosmosjs';

export interface ChainInfoWithExplorer extends ChainInfo {
    // Formed as "https://explorer.com/{txHash}"
    explorerUrlToTx: string;
    faucet?: string;
    hdPath?: string,
    cosmwasmVersion: string,
}

/** basically query and execute, with param : contract, lcd, and simulate is true or false
 */
const message = Cosmos.message;

/**
 * A ChainStore class containing a list of Cosmos chains for deployment & interaction. It also uses Oraichain cosmosjs to encode, query, and broadcast transactions
 */
export class ChainStore extends BaseChainStore<ChainInfoWithExplorer> {
    @observable
    protected chainId: string;
    public cosmos: Cosmos;

    /**
     * Constructor of the ChainStore class. By default, we choose the first chain info in the list of chain infos.
     * @param embedChainInfos - a list of Cosmos chains info.
     */
    constructor(embedChainInfos: ChainInfoWithExplorer[]) {
        super(embedChainInfos);
        this.chainId = embedChainInfos[0].chainId;
        this.cosmos = new Cosmos(embedChainInfos[0].rest.replace(/\/$/, ""), this.chainId);
        this.cosmos.setBech32MainPrefix(embedChainInfos[0].bech32Config.bech32PrefixAccAddr);

        makeObservable(this);
    }

    @computed
    get current(): ChainInfoWithExplorer {
        if (this.hasChain(this.chainId)) {
            return this.getChain(this.chainId).raw;
        }

        throw new Error(`chain id not set`);
    }

    @computed
    get currentFluent() {
        if (this.hasChain(this.chainId)) {
            return this.getChain(this.chainId);
        }

        throw new Error('chain id not set');
    }

    /**
     * Update chain id and other relevant info for cosmosjs & chain info
     * @param chainName 
     */

    @action
    setChain(chainName: string) {
        let chainId = this.getChainId(chainName);
        this.setChainId(chainId);
    }

    private getChainId(chainName: string) {
        if (chainName) {
            let chainInfo = this.chainInfos.find(info => info.chainName === chainName);
            if (chainInfo) return chainInfo.chainId;
            throw new Error(`Chain id not found from chain name: ${chainName}`);
        }
        throw new Error("Invalid chain name");
    }

    @action
    private setChainId(chainId: string) {
        if (chainId) {
            let chainInfo = this.getChain(chainId);
            this.chainId = chainId;
            this.cosmos.chainId = chainId;
            this.cosmos.url = chainInfo.rest;
            this.cosmos.bech32MainPrefix = chainInfo.bech32Config.bech32PrefixAccAddr;
        }
    }

    /**
   * query with json string
   * */
    async query(address: string, input: string) {
        const param = Buffer.from(input).toString("base64");
        if (this.cosmos.chainId === "Simulate") {
            return this.cosmos.get(`/wasm/contract/${address}/query/${param}`);
        }
        return this.cosmos.get(`/wasm/v1beta1/contract/${address}/smart/${param}`);
    }

    /**
     * get the public wallet address given a child key
     * @returns string
     */
    getAddress(childKey: any): string {
        return this.cosmos.getAddress(childKey);
    }

    /**
     * get an object containing marketplace and ow721 contract addresses
     * @returns ContractAddress
     */
    // get contractAddresses(): ContractAddress {
    //     return {
    //         marketplace: process.env.REACT_APP_MARKET_PLACE_CONTRACT,
    //         ow721: process.env.REACT_APP_NFT_TOKEN_CONTRACT,
    //         lock: process.env.REACT_APP_LOCK_CONTRACT_ADDR,
    //         auction: process.env.REACT_APP_AUCTION_CONTRACT,
    //     };
    // }

    /**
     * Status code when broadcasting a tx of Oraichain cosmosjs
     */
    get statusCode(): StatusCode {
        const { statusCode } = this.cosmos;
        console.log("status code: ", statusCode);
        return {
            SUCCESS: statusCode.SUCCESS,
            NOT_FOUND: statusCode.NOT_FOUND,
            GENERIC_ERROR: statusCode.GENERIC_ERROR,
        };
    }

    /**
     * A wrapper function that helps construct an execute contract TxBody data type of CosmWasm. 
     * @param contract - contract address that we want to execute
     * @param msg - the execute message of the contract
     * @param sender - the caller of the contract
     * @param funds (optional) - the funds sent from the sender to the contract
     * @param memo (optional) - memo for the transaction
     * @returns a TxBody type including an execute message
     */
    getHandleMessage(
        contract: string,
        msg: Buffer,
        sender: string,
        funds?: string,
        memo?: string
    ): any {
        const sent_funds = funds
            ? [{ denom: this.cosmos.bech32MainPrefix, amount: funds }]
            : null;

        const msgSend = new message.cosmwasm.wasm.v1beta1.MsgExecuteContract({
            contract,
            msg,
            sender,
            sent_funds,
        });

        const msgSendAny = new message.google.protobuf.Any({
            type_url: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
            value:
                message.cosmwasm.wasm.v1beta1.MsgExecuteContract.encode(
                    msgSend
                ).finish(),
        });

        return new message.cosmos.tx.v1beta1.TxBody({
            messages: [msgSendAny],
            memo,
        });
    }

    /**
     * A wrapper function that helps construct an store code contract TxBody data type of CosmWasm.
     * @param wasm_byte_code - the bytecode of the wasm file
     * @param sender - the caller of the contract
     * @param source (optional) - the source code URL
     * @returns a TxBody type including a store code message
     */
    getStoreMessage(wasm_byte_code: any, sender: string, source?: string | undefined) {
        const msgSend = new message.cosmwasm.wasm.v1beta1.MsgStoreCode({
            wasm_byte_code,
            sender,
            source: source ? source : "",
        });

        const msgSendAny = new message.google.protobuf.Any({
            type_url: "/cosmwasm.wasm.v1beta1.MsgStoreCode",
            value:
                message.cosmwasm.wasm.v1beta1.MsgStoreCode.encode(msgSend).finish(),
        });

        return new message.cosmos.tx.v1beta1.TxBody({
            messages: [msgSendAny],
        });
    }

    /**
     * A wrapper function that helps construct an instantiate contract TxBody data type of CosmWasm.
     * @param code_id - code id of the smart contract
     * @param init_msg - initiate message of the contract
     * @param sender - the caller of the contract
     * @param label - label of the contract
     * @param amount (optional) - the funds sent from the sender to the contract
     * @returns 
     */
    getInstantiateMessage(
        code_id: Long,
        init_msg: any,
        sender: string,
        label: string = "",
        amount: string = ""
    ) {
        const sent_funds = amount
            ? [{ denom: this.cosmos.bech32MainPrefix, amount }]
            : null;
        const msgSend = new message.cosmwasm.wasm.v1beta1.MsgInstantiateContract({
            code_id,
            init_msg,
            label,
            sender,
            init_funds: sent_funds,
        });

        const msgSendAny = new message.google.protobuf.Any({
            type_url: "/cosmwasm.wasm.v1beta1.MsgInstantiateContract",
            value:
                message.cosmwasm.wasm.v1beta1.MsgInstantiateContract.encode(
                    msgSend
                ).finish(),
        });

        return new message.cosmos.tx.v1beta1.TxBody({
            messages: [msgSendAny],
        });
    }

    /**
     * This function encodes the TxBody into bytes
     * @param txBody - TxBody data type
     * @returns Bytes in Uint8Array
     */
    encodeTxBody(txBody: any): Uint8Array {
        return message.cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
    }
}