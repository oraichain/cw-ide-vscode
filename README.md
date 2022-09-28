# Welcome to CosmWasm IDE Extension

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/cosmos-ide.png" alt="CosmWasm IDE logo"></a> &nbsp
  <a href="https://orai.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/logo-128.png" alt="Oraichain logo"></a>
</p>

<h1 align="center">
    CosmosWasm IDE - An open-source project for CosmWasm smart contract developers  
</h1>

## CosmWasm IDE Optimization

This is a bash script with a locked set of dependencies to produce
reproducible builds of cosmwasm smart contracts. It also does heavy
optimization on the build size, using binary stripping and `wasm-opt`.

## CosmWasm IDE Extension Interface

The extension provides three custom VS Code buttons: `Build CosmWasm`, `Deploy CosmWasm`, `Upload CosmWasm` and `Instantiate CosmWasm` under the status bar of Vs Code and a `CosmWasm IDE Explorer` under the `Explorer` tab of VS Code.

- `Build CosmWasm` button will build the smart contract to the .wasm file based on the file you open in VS Code.
- `Deploy CosmWasm` button will deploy your contract onto the network that you choose on the CosmWasm IDE explorer.
- `Instantiate CosmWasm` button will instantiate your contract onto the network that you choose on the explorer.
- `Upload CosmWasm` button will upload your contract onto the network that you choose on the explorer.

[CosmWasm IDE Webview](https://github.com/oraichain/cw-ide-webview.git) (the local webview has a default url: http://localhost:3000/). This allows the frontend & CosmWasm developers to easily customize the extension UI, adding new testnets for the development purposes & so on without cloning this repository.

The CosmWasm IDE Explorer helps you modify the destination network that you want to interact with, and you can use it to interact with the smart contract you deploy with corresponding execute and query actions.

## Development

## Deploy to Vscode marketplace

vsce publish --pat $AUTHORIZATION

````

## Deploy to Eclipse Open VSX for Gitpod

```sh
ovsx publish --pat $AUTHORIZATION
````
