export default class Keplr {
    public chainId: string;
    private rpc: string;
    private lcd: string;
    private coinDenom: string;
    private prefix: string;

    constructor(chainId: string, rpc: string, lcd: string, coinDenom: string, prefix: string) {
        this.chainId = chainId;
        this.rpc = rpc;
        this.lcd = lcd;
        this.coinDenom = coinDenom;
        this.prefix = prefix;
    }

    suggestOraichain = async () => {
        await window.keplr.experimentalSuggestChain({
            // Chain-id of the Cosmos SDK chain.
            chainId: this.chainId,
            // The name of the chain to be displayed to the user.
            chainName: this.chainId,
            // RPC endpoint of the chain.
            rpc: this.rpc,
            // REST endpoint of the chain.
            rest: this.lcd,
            walletUrl: 'https://app.oraiwallet.io',
            // Staking coin information
            stakeCurrency: {
                // Coin denomination to be displayed to the user.
                coinDenom: this.coinDenom,
                // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                coinMinimalDenom: this.prefix,
                // # of decimal points to convert minimal denomination to user-facing denomination.
                coinDecimals: 6,
                // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                coinGeckoId: 'oraichain-token',
            },
            // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
            // The 'stake' button in Keplr extension will link to the webpage.
            // walletUrlForStaking: "",
            // The BIP44 path.
            bip44: {
                // You can only set the coin type of BIP44.
                // 'Purpose' is fixed to 44.
                coinType: 118,
            },
            // Bech32 configuration to show the address to user.
            // This field is the interface of
            // {
            //   bech32PrefixAccAddr: string;
            //   bech32PrefixAccPub: string;
            //   bech32PrefixValAddr: string;
            //   bech32PrefixValPub: string;
            //   bech32PrefixConsAddr: string;
            //   bech32PrefixConsPub: string;
            // }
            bech32Config: {
                bech32PrefixAccAddr: this.prefix,
                bech32PrefixAccPub: this.prefix + 'pub',
                bech32PrefixValAddr: this.prefix + 'valoper',
                bech32PrefixValPub: this.prefix + 'valoperpub',
                bech32PrefixConsAddr: this.prefix + 'valcons',
                bech32PrefixConsPub: this.prefix + 'valconspub',
            },
            // List of all coin/tokens used in this chain.
            currencies: [
                {
                    coinDenom: this.coinDenom,
                    coinMinimalDenom: this.prefix,
                    coinDecimals: 6,
                    coinGeckoId: 'oraichain-token',
                },
            ],
            // List of coin/tokens used as a fee token in this chain.
            feeCurrencies: [
                {
                    coinDenom: this.coinDenom,
                    coinMinimalDenom: this.prefix,
                    coinDecimals: 6,
                    coinGeckoId: 'oraichain-token',
                },
            ],
            // (Optional) The number of the coin type.
            // This field is only used to fetch the address from ENS.
            // Ideally, it is recommended to be the same with BIP44 path's coin type.
            // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
            // So, this is separated to support such chains.
            // coinType: 118,
            // (Optional) This is used to set the fee of the transaction.
            // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
            // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
            // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
            gasPriceStep: {
                low: 0,
                average: 0.0025,
                high: 0.004,
            },
            features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        });
        await window.keplr.enable(this.chainId);

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
            if (document.readyState === 'complete') {
                window.keplr.defaultOptions = {
                    sign: {
                        preferNoSetFee: true,
                        preferNoSetMemo: true,
                    },
                };
                return window.keplr;
            }
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
        const keplr = await this.getKeplr();
        if (keplr) {
            return keplr.getKey(this.chainId);
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

    public getFixedSignDoc(chainId: String): Object {
        return {
            bodyBytes: Uint8Array.from(
                Buffer.from(
                    '0a5e0a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e64123e0a2b6f726169313476637735716b307464766b6e70613338777a34366a733567377672767574386c6b306c6b36120473656e641a090a046f7261691201311200',
                    'hex',
                ),
            ),
            authInfoBytes: Uint8Array.from(
                Buffer.from(
                    '0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21021ef7a6ca776700df52daea4f651428a6cdeffe17e6ae2028571eada6d500eb5a12040a0208011800120f0a090a046f72616912013010c09a0c',
                    'hex',
                ),
            ),
            chainId,
            accountNumber: 0,
        };
    }

    public async handleKeplr(
        sender: string,
        txBody: any,
        pubKey: Uint8Array,
        { accountNumber, sequence, gas, fees, mode }: ExecuteKeplrOptions,
    ) {
        const keplr = await this.getKeplr();
        if (!keplr) throw Object.assign(
            new Error('Your must install Keplr Wallet to continue'),
            { code: 404 }
        );
        const { cosmos } = window.Wasm;
        const bodyBytes = window.Wasm.encodeTxBody(txBody);
        const pubKeyAny = cosmos.getPubKeyAnyWithPub(pubKey);
        const authInfoBytes = cosmos.constructAuthInfoBytes(pubKeyAny, gas, fees, sequence);
        const response = await window.keplr.signDirect(cosmos.chainId, sender, {
            bodyBytes,
            authInfoBytes,
            chainId: cosmos.chainId,
            accountNumber,
        });
        const signature = Buffer.from(response.signature.signature, 'base64');
        console.log('signature when signing using Keplr: ', signature);
        const txBytes = cosmos.constructTxBytes(response.signed.bodyBytes, response.signed.authInfoBytes, [signature]);
        const res = await cosmos.broadcast(txBytes, mode);
        console.log('response data: ', res);
        return res;
    }
}
