import { Bech32Address } from '@keplr-wallet/cosmos';
import { ChainInfoWithExplorer } from './stores/chain';

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 */
export const EmbedChainInfos: ChainInfoWithExplorer[] = [
    {
        rpc: 'https://testnet-rpc.orai.io',
        rest: 'https://testnet-lcd.orai.io',
        chainId: 'Oraichain-testnet',
        chainName: 'Oraichain Testnet',
        stakeCurrency: {
            coinDenom: 'ORAI',
            coinMinimalDenom: 'orai',
            coinDecimals: 6,
            coinGeckoId: 'oraichain-token',
            coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config('orai'),
        currencies: [
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
        ],
        gasPriceStep: {
            low: 0,
            average: 0.0025,
            high: 0.004,
        },
        features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        explorerUrlToTx: 'https://testnet.scan.orai.io/txs/${txHash}',
        hdPath: "m/44'/118'/0'/0/0",
        cosmwasmVersion: '0.13.2'
    },
    {
        rpc: 'https://rpc.orai.io',
        rest: 'https://lcd.orai.io',
        chainId: 'Oraichain',
        chainName: 'Oraichain',
        stakeCurrency: {
            coinDenom: 'ORAI',
            coinMinimalDenom: 'orai',
            coinDecimals: 6,
            coinGeckoId: 'oraichain-token',
            coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
        },
        walletUrl: 'https://api.wallet.orai.io',
        bip44: {
            coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config('orai'),
        currencies: [
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'ORAI',
                coinMinimalDenom: 'orai',
                coinDecimals: 6,
                coinGeckoId: 'oraichain-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/orai.png',
            },
        ],
        gasPriceStep: {
            low: 0,
            average: 0.0025,
            high: 0.004,
        },
        features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        explorerUrlToTx: 'https://scan.orai.io/txs/${txHash}',
        hdPath: "m/44'/118'/0'/0/0",
        cosmwasmVersion: '0.13.2'
    },
    // {
    //     rpc: 'https://bombay-fcd.terra.dev',
    //     rest: 'https://bombay-fcd.terra.dev',
    //     chainId: 'bombay-12',
    //     chainName: 'Terra Network Testnet',
    //     stakeCurrency: {
    //         coinDenom: 'LUNA',
    //         coinMinimalDenom: 'uluna',
    //         coinDecimals: 6,
    //         coinGeckoId: 'terra-luna',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //     },
    //     bip44: {
    //         coinType: 118,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('terra'),
    //     currencies: [
    //         {
    //             coinDenom: 'LUMA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //         {
    //             coinDenom: 'LUMA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'LUNA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://finder.terra.money/testnet/tx/{txHash}',
    //     faucet: 'https://faucet.terra.money',
    // },
    // {
    //     rpc: 'https://bombay-fcd.terra.dev',
    //     rest: 'https://fcd.terra.dev',
    //     chainId: 'columbus-5',
    //     chainName: 'Terra Network',
    //     stakeCurrency: {
    //         coinDenom: 'LUNA',
    //         coinMinimalDenom: 'uluna',
    //         coinDecimals: 6,
    //         coinGeckoId: 'terra-luna',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //     },
    //     bip44: {
    //         coinType: 118,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('terra'),
    //     currencies: [
    //         {
    //             coinDenom: 'LUMA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //         {
    //             coinDenom: 'LUMA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'LUNA',
    //             coinMinimalDenom: 'uluna',
    //             coinDecimals: 6,
    //             coinGeckoId: 'terra-luna',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://finder.terra.money/mainnet/tx/{txHash}',
    // },
    {
        rpc: 'https://rpc.test.provenance.io',
        rest: 'https://lcd.test.provenance.io',
        chainId: 'pio-testnet-1',
        chainName: 'Proverance Testnet',
        stakeCurrency: {
            coinDenom: 'HASH',
            coinMinimalDenom: 'nhash',
            coinDecimals: 9,
            coinGeckoId: 'hash-token',
            coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config('tp'),
        currencies: [
            {
                coinDenom: 'HASH',
                coinMinimalDenom: 'nhash',
                coinDecimals: 9,
                coinGeckoId: 'hash-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
            },
            {
                coinDenom: 'HASH',
                coinMinimalDenom: 'nhash',
                coinDecimals: 9,
                coinGeckoId: 'hash-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'HASH',
                coinMinimalDenom: 'nhash',
                coinDecimals: 9,
                coinGeckoId: 'hash-token',
                coinImageUrl: window.location.origin + '/public/assets/tokens/terra.png',
            },
        ],
        features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        explorerUrlToTx: 'https://explorer.test.provenance.io/tx/{txHash}',
        cosmwasmVersion: '0.16.0'
    },
    {
        rpc: 'https://rpc-stargateworld.fetch.ai',
        rest: 'https://rest-stargateworld.fetch.ai',
        chainId: 'stargateworld-3',
        chainName: 'Fetch AI Testnet',
        stakeCurrency: {
            coinDenom: 'testfet',
            coinMinimalDenom: 'atestfest',
            coinDecimals: 18,
            coinGeckoId: 'fetch-ai',
            coinImageUrl: window.location.origin + '/public/assets/tokens/fetch-ai.png',
        },
        bip44: {
            coinType: 118,
        },
        bech32Config: Bech32Address.defaultBech32Config('fetch'),
        currencies: [
            {
                coinDenom: 'testfet',
                coinMinimalDenom: 'atestfest',
                coinDecimals: 18,
                coinGeckoId: 'fetch-ai',
                coinImageUrl: window.location.origin + '/public/assets/tokens/fetch-ai.png',
            },
            {
                coinDenom: 'testfet',
                coinMinimalDenom: 'atestfest',
                coinDecimals: 18,
                coinGeckoId: 'fetch-ai',
                coinImageUrl: window.location.origin + '/public/assets/tokens/fetch-ai.png',
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'testfet',
                coinMinimalDenom: 'atestfest',
                coinDecimals: 18,
                coinGeckoId: 'fetch-ai',
                coinImageUrl: window.location.origin + '/public/assets/tokens/fetch-ai.png',
            },
        ],
        features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        explorerUrlToTx: 'https://explore-stargateworld.fetch.ai/transactions/{txHash}',
        hdPath: "m/44'/118'/0'/0/0",
        cosmwasmVersion: '0.14.0'
    },
    // {
    //     rpc: 'https://rpc-regen.keplr.app',
    //     rest: 'https://lcd-regen.keplr.app',
    //     chainId: 'regen-1',
    //     chainName: 'Regen Network',
    //     stakeCurrency: {
    //         coinDenom: 'REGEN',
    //         coinMinimalDenom: 'uregen',
    //         coinDecimals: 6,
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
    //         coinGeckoId: 'regen',
    //     },
    //     bip44: { coinType: 118 },
    //     bech32Config: Bech32Address.defaultBech32Config('regen'),
    //     currencies: [
    //         {
    //             coinDenom: 'REGEN',
    //             coinMinimalDenom: 'uregen',
    //             coinDecimals: 6,
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
    //             coinGeckoId: 'regen',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'REGEN',
    //             coinMinimalDenom: 'uregen',
    //             coinDecimals: 6,
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/regen.png',
    //             coinGeckoId: 'regen',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://regen.aneka.io/txs/{txHash}',
    // },
    // {
    //     rpc: 'https://rpc-sentinel.keplr.app',
    //     rest: 'https://lcd-sentinel.keplr.app',
    //     chainId: 'sentinelhub-2',
    //     chainName: 'Sentinel',
    //     stakeCurrency: {
    //         coinDenom: 'DVPN',
    //         coinMinimalDenom: 'udvpn',
    //         coinDecimals: 6,
    //         coinGeckoId: 'sentinel',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
    //     },
    //     bip44: { coinType: 118 },
    //     bech32Config: Bech32Address.defaultBech32Config('sent'),
    //     currencies: [
    //         {
    //             coinDenom: 'DVPN',
    //             coinMinimalDenom: 'udvpn',
    //             coinDecimals: 6,
    //             coinGeckoId: 'sentinel',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'DVPN',
    //             coinMinimalDenom: 'udvpn',
    //             coinDecimals: 6,
    //             coinGeckoId: 'sentinel',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/dvpn.png',
    //         },
    //     ],
    //     explorerUrlToTx: 'https://www.mintscan.io/sentinel/txs/{txHash}',
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    // },
    // {
    //     rpc: 'https://rpc-persistence.keplr.app',
    //     rest: 'https://lcd-persistence.keplr.app',
    //     chainId: 'core-1',
    //     chainName: 'Persistence',
    //     stakeCurrency: {
    //         coinDenom: 'XPRT',
    //         coinMinimalDenom: 'uxprt',
    //         coinDecimals: 6,
    //         coinGeckoId: 'persistence',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
    //     },
    //     bip44: {
    //         coinType: 750,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('persistence'),
    //     currencies: [
    //         {
    //             coinDenom: 'XPRT',
    //             coinMinimalDenom: 'uxprt',
    //             coinDecimals: 6,
    //             coinGeckoId: 'persistence',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'XPRT',
    //             coinMinimalDenom: 'uxprt',
    //             coinDecimals: 6,
    //             coinGeckoId: 'persistence',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/xprt.png',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://www.mintscan.io/persistence/txs/{txHash}',
    // },
    // {
    //     rpc: 'https://rpc-iris.keplr.app',
    //     rest: 'https://lcd-iris.keplr.app',
    //     chainId: 'irishub-1',
    //     chainName: 'IRISnet',
    //     stakeCurrency: {
    //         coinDenom: 'IRIS',
    //         coinMinimalDenom: 'uiris',
    //         coinDecimals: 6,
    //         coinGeckoId: 'iris-network',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //     },
    //     bip44: {
    //         coinType: 118,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('iaa'),
    //     currencies: [
    //         {
    //             coinDenom: 'IRIS',
    //             coinMinimalDenom: 'uiris',
    //             coinDecimals: 6,
    //             coinGeckoId: 'iris-network',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'IRIS',
    //             coinMinimalDenom: 'uiris',
    //             coinDecimals: 6,
    //             coinGeckoId: 'iris-network',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://www.mintscan.io/iris/txs/{txHash}',
    // },
    // {
    //     rpc: 'http://35.234.10.84:26657',
    //     rest: 'http://35.234.10.84:1317',
    //     chainId: 'nyancat-9',
    //     chainName: 'IRISnet Testnet',
    //     stakeCurrency: {
    //         coinDenom: 'IRIS',
    //         coinMinimalDenom: 'uiris',
    //         coinDecimals: 6,
    //         coinGeckoId: 'iris-network',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //     },
    //     bip44: {
    //         coinType: 118,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('iaa'),
    //     currencies: [
    //         {
    //             coinDenom: 'IRIS',
    //             coinMinimalDenom: 'uiris',
    //             coinDecimals: 6,
    //             coinGeckoId: 'iris-network',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'IRIS',
    //             coinMinimalDenom: 'uiris',
    //             coinDecimals: 6,
    //             coinGeckoId: 'iris-network',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/iris.svg',
    //         },
    //     ],
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://nyancat.iobscan.io/#/tx?txHash={txHash}',
    // },
    // {
    //     rpc: 'https://rpc-emoney.keplr.app',
    //     rest: 'https://lcd-emoney.keplr.app',
    //     chainId: 'emoney-3',
    //     chainName: 'e-Money',
    //     stakeCurrency: {
    //         coinDenom: 'NGM',
    //         coinMinimalDenom: 'ungm',
    //         coinDecimals: 6,
    //         coinGeckoId: 'e-money',
    //         coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
    //     },
    //     bip44: {
    //         coinType: 118,
    //     },
    //     bech32Config: Bech32Address.defaultBech32Config('emoney'),
    //     currencies: [
    //         {
    //             coinDenom: 'NGM',
    //             coinMinimalDenom: 'ungm',
    //             coinDecimals: 6,
    //             coinGeckoId: 'e-money',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
    //         },
    //         {
    //             coinDenom: 'EEUR',
    //             coinMinimalDenom: 'eeur',
    //             coinDecimals: 6,
    //             coinGeckoId: 'e-money-eur',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
    //         },
    //     ],
    //     feeCurrencies: [
    //         {
    //             coinDenom: 'NGM',
    //             coinMinimalDenom: 'ungm',
    //             coinDecimals: 6,
    //             coinGeckoId: 'e-money',
    //             coinImageUrl: window.location.origin + '/public/assets/tokens/ngm.png',
    //         },
    //     ],
    //     gasPriceStep: {
    //         low: 1,
    //         average: 1,
    //         high: 1,
    //     },
    //     features: ['stargate', 'ibc-transfer', 'cosmwasm'],
    //     explorerUrlToTx: 'https://emoney.bigdipper.live/transactions/${txHash}',
    // },
];