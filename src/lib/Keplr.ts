import { ChainInfo } from "@keplr-wallet/types";
import { BroadCastMode } from "@oraichain/cosmosjs";

export default class Keplr {

    suggestChain = async () => {
        let { current } = window.chainStore;
        console.log("window chainstore current: ", window.chainStore.current);
        await window.keplr.experimentalSuggestChain(current);
        console.log("after suggest chain");
        await window.keplr.enable(current.chainId);
        console.log("enabled");

        // dont override memo & fees
        window.keplr.defaultOptions = {
            sign: {
                preferNoSetFee: true,
                preferNoSetMemo: true,
            },
        };
    };

    async getKeplr(): Promise<keplrType | undefined> {
        if (document.readyState === 'complete' && window.keplr) {
            window.keplr.defaultOptions = {
                sign: {
                    preferNoSetFee: true,
                    preferNoSetMemo: true,
                },
            };
            return window.keplr;
        }

        return new Promise((resolve) => {
            const documentStateChange = (event: Event) => {
                if (event.target && (event.target as Document).readyState === 'complete') {
                    if (window.keplr) {
                        window.keplr.defaultOptions = {
                            sign: {
                                preferNoSetFee: true,
                                preferNoSetMemo: true,
                            },
                        };
                    }
                    resolve(window.keplr);
                    document.removeEventListener('readystatechange', documentStateChange);
                }
            };
            document.addEventListener('readystatechange', documentStateChange);
        });
    }

    private async getKeplrKey(): Promise<any | undefined> {
        let { current } = window.chainStore;
        const keplr = await this.getKeplr();
        if (keplr) {
            console.log("keplr key: ", await keplr.getKey(current.chainId));
            return keplr.getKey(current.chainId);
        }
        return undefined;
    }

    async getKeplrAddr(): Promise<String | undefined> {
        const key = await this.getKeplrKey();
        return key.bech32Address;
    }

    async getKeplrPubKey(): Promise<Uint8Array | undefined> {
        const key = await this.getKeplrKey();
        return key.pubKey;
    }

    public async handleKeplr(
        sender: string,
        txBody: any,
        pubKey: Uint8Array,
        { accountNumber, sequence, gas, fees, mode }: ExecuteKeplrOptions,
    ) {
        const { chainStore } = window;
        let { current, cosmos } = chainStore;
        const keplr = await this.getKeplr();
        if (!keplr) throw Object.assign(
            new Error('Your must install Keplr Wallet to continue'),
            { code: 404 }
        );
        const bodyBytes = chainStore.encodeTxBody(txBody);
        const pubKeyAny = cosmos.getPubKeyAnyWithPub(pubKey);
        const authInfoBytes = cosmos.constructAuthInfoBytes(pubKeyAny, gas, fees, sequence);
        const response = await window.keplr.signDirect(current.chainId, sender, {
            bodyBytes,
            authInfoBytes,
            chainId: current.chainId,
            accountNumber,
        });
        const signature = Buffer.from(response.signature.signature, 'base64');
        console.log('signature when signing using Keplr: ', signature);
        const txBytes = cosmos.constructTxBytes(response.signed.bodyBytes, response.signed.authInfoBytes, [signature]);
        const res = await cosmos.broadcast(txBytes, mode as BroadCastMode);
        console.log('response data: ', res);
        return res;
    }
}
