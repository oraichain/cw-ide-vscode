import Cosmos from "@oraichain/cosmosjs";
import { Buffer } from "buffer";
import { BroadCastMode } from "@oraichain/cosmosjs";

/** basically query and execute, with param : contract, lcd, and simulate is true or false
 */
const message = Cosmos.message;
/**
 * If there is chainId it will interacte with blockchain, otherwise using simulator
 */
class Wasm {
  public cosmos: Cosmos;
  constructor(baseUrl: string, chainId: string = "Simulate") {
    this.cosmos = new Cosmos(baseUrl.replace(/\/$/, ""), chainId);
    this.cosmos.setBech32MainPrefix("orai");
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

  get statusCode(): StatusCode {
    const { statusCode } = this.cosmos;
    console.log("status code: ", statusCode);
    return {
      SUCCESS: statusCode.SUCCESS,
      NOT_FOUND: statusCode.NOT_FOUND,
      GENERIC_ERROR: statusCode.GENERIC_ERROR,
    };
  }

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

  getStoreMessage(wasm_byte_code: any, sender: string, source: string) {
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

  encodeTxBody(txBody: any): Uint8Array {
    return message.cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
  }

  // a wrapper method to deploy a smart contract
  async handleDeploy(mnemonic: any | undefined, wasmBody: any, initInput: any) {
    console.log("mnemonic: ", mnemonic);
    if (process.env.REACT_APP_ENV === "vscode-dev" || mnemonic) {
      console.log("in development")
      const childKey = this.cosmos.getChildKey(mnemonic);
      const sender = this.cosmos.getAddress(childKey);
      const txBody = this.getStoreMessage(wasmBody, sender, '');
      // store code;
      const res = await this.cosmos.submit(
        childKey,
        txBody,
        'BROADCAST_MODE_BLOCK',
        0,
        20000000
      );
      console.log('res: ', res);
      // instantiate

      const codeId = res.tx_response.logs[0].events[0].attributes.find(
        (attr: any) => attr.key === 'code_id'
      ).value;
      const input = Buffer.from(initInput).toString('base64');
      const txBody2 = this.getInstantiateMessage(
        codeId,
        input,
        sender,
        'demo smart contract'
      );
      const res2 = await this.cosmos.submit(
        childKey,
        txBody2,
        'BROADCAST_MODE_BLOCK',
        0,
        20000000
      );

      console.log(res2);
      // return the contract address after successful
      return JSON.parse(res2.tx_response.raw_log)[0].events[1]
        .attributes[0].value;
    } else if (process.env.REACT_APP_ENV === "production" || process.env.REACT_APP_ENV === "browser-dev") {
      const wasmBodyTemp = process.env.REACT_APP_KEPLR_TEST ? await fetch("https://gist.githubusercontent.com/ducphamle2/be7febd2a4da0f00b942ece37709120a/raw/a775a15f1932c44972f66a0dade29a381a1cb8fa/wasm-body-example.txt").then(data => data.text()) : wasmBody;
      const keplr = await window.Keplr.getKeplr();
      if (keplr) {

        // login
        await window.Keplr.suggestOraichain();
        const key = await keplr.getKey(this.cosmos.chainId);
        const sender = key.bech32Address;
        // demo ping
        const txBody = window.Wasm.getStoreMessage(wasmBodyTemp, sender, "");

        let { account_number, sequence } = (
          await this.cosmos.get(`/cosmos/auth/v1beta1/accounts/${sender}`)
        ).account;
        const res = await window.Keplr.handleKeplr(sender, txBody, key.pubKey, {
          accountNumber: account_number,
          sequence,
          gas: 20000000,
          fees: 0,
          mode: 'BROADCAST_MODE_BLOCK'
        });
        console.log("response: ", res);

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
        // increment sequence
        let newSequence = parseInt(sequence) + 1;

        const res2 = await window.Keplr.handleKeplr(sender, txBody2, key.pubKey, {
          accountNumber: account_number,
          sequence: newSequence,
          gas: 20000000,
          fees: 0,
          mode: 'BROADCAST_MODE_BLOCK'
        });

        console.log(res2);
        return JSON.parse(res2.tx_response.raw_log)[0].events[1]
          .attributes[0].value;
      } else {
        throw "You must install Keplr to continue signing this transaction";
      }
    } else {
      console.log("wrong env");
      throw "Wrong env"
    }
  }
}

export default Wasm;
