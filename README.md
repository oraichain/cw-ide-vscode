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

## Deploy to vscode marketplace

```sh
vsce package
vsce publish --pat $AUTHORIZATION
```

## Deploy to Eclipse Open VSX for Gitpod

```sh
ovsx publish --pat $AUTHORIZATION
```