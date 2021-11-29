import { Buffer } from "buffer";

const WASM = {

  /**
   * a wrapper method to deploy a smart contract
   * @param mnemonic - Your wallet's mnemonic to deploy the contract
   * @param wasmBody - The bytecode of the wasm contract file
   * @param initInput - initiate message of the contract in object string (use JSON.stringtify)
   * @param label (optional) - contract label 
   * @returns 
   */
  async handleDeploy(args: { mnemonic: any | undefined, wasmBody: any, initInput: any, label: string, sourceCode?: string | undefined, fees?: any[] | undefined }) {
    const { chainStore } = window;
    const { cosmos } = chainStore;
    const { mnemonic, wasmBody, initInput, label, sourceCode, fees } = args;
    try {
      if (process.env.REACT_APP_ENV === "vscode-dev" || mnemonic) {
        console.log("in production ready to use cosmosjs oraichain");
        const childKey = cosmos.getChildKey(mnemonic);
        const sender = cosmos.getAddress(childKey);
        const txBody = chainStore.getStoreMessage(wasmBody, sender, sourceCode);
        // store code;
        const res = await cosmos.submit(
          childKey,
          txBody,
          'BROADCAST_MODE_BLOCK',
          fees,
          20000000
        );
        console.log('res: ', res);
        // instantiate

        const codeId = res.tx_response.logs[0].events[0].attributes.find(
          (attr: any) => attr.key === 'code_id'
        ).value;
        const input = Buffer.from(initInput).toString('base64');
        const txBody2 = chainStore.getInstantiateMessage(
          codeId,
          input,
          sender,
          label ? label : 'demo smart contract'
        );
        const res2 = await cosmos.submit(
          childKey,
          txBody2,
          'BROADCAST_MODE_BLOCK',
          fees,
          20000000
        );

        console.log(res2);
        // return the contract address after successful
        return JSON.parse(res2.tx_response.raw_log)[0].events[1]
          .attributes[0].value;
        // } else if (process.env.REACT_APP_ENV === "production" || process.env.REACT_APP_ENV === "browser-dev") {
        //   const wasmBodyTemp = process.env.REACT_APP_KEPLR_TEST ? await fetch("https://gist.githubusercontent.com/ducphamle2/be7febd2a4da0f00b942ece37709120a/raw/a775a15f1932c44972f66a0dade29a381a1cb8fa/wasm-body-example.txt").then(data => data.text()) : wasmBody;
        //   console.log("in production ready to use keplr");
        //   console.log("chain store: ", window.chainStore);
        //   console.log("wasm body: ", wasmBody);
        //   // const keplr = await window.Keplr.getKeplr();
        //   if (window.keplr) {
        //     console.log("keplr exists");
        //     // login
        //     // await window.Keplr.suggestChain();
        //     await window.keplr.enable("cosmoshub-4");
        //     let sender = await window.Keplr.getKeplrAddr() as string;
        //     let pubKey = await window.Keplr.getKeplrPubKey() as Uint8Array;
        //     console.log("sender: ", sender);
        //     // demo ping
        //     const txBody = chainStore.getStoreMessage(wasmBodyTemp, sender, "");

        //     let { account_number, sequence } = (
        //       await cosmos.get(`/cosmos/auth/v1beta1/accounts/${sender}`)
        //     ).account;
        //     console.log("account number: ", account_number);
        //     const res = await window.Keplr.handleKeplr(sender, txBody, pubKey, {
        //       accountNumber: account_number,
        //       sequence,
        //       gas: 20000000,
        //       fees: 0,
        //       mode: 'BROADCAST_MODE_BLOCK'
        //     });
        //     console.log("response: ", res);

        //     // instantiate

        //     const codeId = res.tx_response.logs[0].events[0].attributes.find(
        //       (attr: any) => attr.key === "code_id"
        //     ).value;
        //     const input = Buffer.from(initInput).toString("base64");
        //     const txBody2 = chainStore.getInstantiateMessage(
        //       codeId,
        //       input,
        //       sender,
        //       "demo smart contract"
        //     );
        //     // increment sequence
        //     let newSequence = parseInt(sequence) + 1;

        //     const res2 = await window.Keplr.handleKeplr(sender, txBody2, pubKey, {
        //       accountNumber: account_number,
        //       sequence: newSequence,
        //       gas: 20000000,
        //       fees: 0,
        //       mode: 'BROADCAST_MODE_BLOCK'
        //     });

        //     console.log(res2);
        //     return JSON.parse(res2.tx_response.raw_log)[0].events[1]
        //       .attributes[0].value;
        //   } else {
        //     throw "You must install Keplr to continue signing this transaction";
        //   }
      } else {
        console.log("wrong env");
        throw "Wrong env"
      }
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }
}

export default WASM;