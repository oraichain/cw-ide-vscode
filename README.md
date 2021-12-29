# Welcome to CosmWasm VS Code Extension

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/cosmos-ide.png" alt="CosmWasm IDE logo"></a> &nbsp
  <a href="https://orai.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/logo-128.png" alt="Oraichain logo"></a>
</p>

<h1 align="center">
    CosmosWasm IDE - An open-source project for CosmWasm smart contract developers  
</h1>

## cosmWasm-optimize

This is a bash script with a locked set of dependencies to produce
reproducible builds of cosmwasm smart contracts. It also does heavy
optimization on the build size, using binary stripping and `wasm-opt`.

## cosmwasm-vscode interface

The extension provides two custom VS Code buttons: ```Build CosmWasm```,  ```Deploy Cosmwasm``` under the status bar of Vs Code and a ```CosmWasm IDE Explorer``` under the ```Explorer``` tab of VS Code. The ```Build CosmWasm``` button will build the smart contract to the .wasm file based on the file you open in VS Code. Meanwhile, the ```Deploy Cosmwasm``` button will deploy your contract onto a network that you choose on the CosmWasm IDE explorer.

The CosmWasm IDE Explorer helps you modify the destination network that you want to interact with, and you can use it to interact with the smart contract you deploy with corresponding execute and query actions.

## Add more Cosmos networks

At the moment, you need to create a PR submitting your network information. Afterward, we will review and merge it. Below is the format for the network's metadata:

```js
{
        rpc: 'your rpc url. Eg: https://testnet-rpc.orai.io',
        rest: 'your rest url. Eg: https://testnet-lcd.orai.io',
        chainId: 'your chain id. Eg: Oraichain-testnet',
        chainName: 'your chain name. Eg: Oraichain Testnet',
        stakeCurrency: {
            coinDenom: 'your coin denomination. Eg: ORAI',
            coinMinimalDenom: 'your coin denomination. Eg: uorai',
            coinDecimals: 6,
            coinGeckoId: 'your coingecko id. Eg: oraichain-token',
            coinImageUrl: 'your token symbol url',
        },
        bip44: {
            coinType: 118 // or another number
        },
        bech32Config: Bech32Address.defaultBech32Config('orai'),
        currencies: [
            {
                coinDenom: 'your coin denomination. Eg: ORAI',
                coinMinimalDenom: 'your coin denomination. Eg: uorai',
                coinDecimals: 6,  // or another number
                coinGeckoId: 'your coingecko id. Eg: oraichain-token',
                coinImageUrl: 'your token symbol url',
            },
            {
                coinDenom: 'your coin denomination. Eg: ORAI',
                coinMinimalDenom: 'your coin denomination. Eg: uorai',
                coinDecimals: 6, // or another number
                coinGeckoId: 'your coingecko id. Eg: oraichain-token',
                coinImageUrl: 'your token symbol url',
            },
        ],
        feeCurrencies: [
            {
                coinDenom: 'your coin denomination. Eg: ORAI',
                coinMinimalDenom: 'your coin denomination. Eg: uorai',
                coinDecimals: 6,
                coinGeckoId: 'your coingecko id. Eg: oraichain-token',
                coinImageUrl: 'your token symbol url',
            },
        ],
        gasPriceStep: {
            low: 0,  // or another number
            average: 0.0025,  // or another number
            high: 0.004,  // or another number
        },
        features: ['stargate', 'ibc-transfer', 'cosmwasm'],
        explorerUrlToTx: 'Your explorer endpoint. Eg: https://testnet.scan.orai.io/txs/${txHash}',
        hdPath: "your wallet hd path. Eg: m/44'/118'/0'/0/0",
        cosmwasmVersion: 'your cosmwasm version. Eg: 0.13.2'
    }
```

Please append the network information into the [config file](https://github.com/oraichain/vscode-cosmwasm/blob/master/src/config.ts).

## Deploy to vscode marketplace

Deploying to vscode marketplace is a bit tricky. The webview of the extension has been moved to a [different repository](https://github.com/oraichain/cw-ide-webview). In addition, since vscode cannot use Keplr, it's no use using the website as the iframe's source. Instead, we only need to copy the build/ directory from the webview repository. Next, copy the .env into the out/ directory so the extension can identify the environment it is running on. We then need to change the ```homepage``` in ```package.json``` file to ".". Finally, we publish the extension onto the vscode marketplace. Below are the steps to deploy the extension to the marketplace:

```sh
sudo apt-get install jq && mv package.json package-temp.json && jq '.homepage = "."' package-temp.json > package.json
cp -r ../cw-ide-webview/build ./
cp .env.vscode-dev .env
vsce publish --pat $AUTHORIZATION
mv package-temp.json package.json
```

## Deploy to Eclipse Open VSX for Gitpod

```sh
ovsx publish --pat $AUTHORIZATION
```

Currently, the project's github action automatically deploys the extension onto OVSX when merging into the master branch