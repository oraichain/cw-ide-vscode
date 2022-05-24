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

The extension provides three custom VS Code buttons: ```Build CosmWasm```,  ```Deploy Cosmwasm``` & ```Toggle Development Mode``` under the status bar of Vs Code and a ```CosmWasm IDE Explorer``` under the ```Explorer``` tab of VS Code. 

- ```Build CosmWasm``` button will build the smart contract to the .wasm file based on the file you open in VS Code.
- ```Deploy Cosmwasm``` button will deploy your contract onto a network that you choose on the CosmWasm IDE explorer.
- ```Toggle Development Mode``` button will toggle between the production and local [CosmWasm IDE Webview](https://github.com/oraichain/cw-ide-webview.git) (the local webview has a default url: http://localhost:3000/). This allows the frontend & CosmWasm developers to easily customize the extension UI, adding new testnets for the development purposes & so on without cloning this repository.

The CosmWasm IDE Explorer helps you modify the destination network that you want to interact with, and you can use it to interact with the smart contract you deploy with corresponding execute and query actions.

## Quick tutorial

### Gitpod users

The fastest way to start developing & deploying a CosmWasm smart contract is to use Gitpod, a tool that automates the environment installation process. For more information, please click [Here](https://github.com/oraichain/cosmwasm-gitpod/blob/master/README.md).

### Local development users

#### 1. Setting up the environment

For those who want to develop the contracts locally, it's best to use Docker to automatically install all the libraries & tools for you.

docker-compose.yml file:

```bash
version: '3.3'
services:
  app:
    image: orai/cosmwasm-optimizer:0.0.1 # derived from cosmwasm/workspace-optimizer:0.12.6. Source: https://github.com/CosmWasm/rust-optimizer
    entrypoint: tail -f /dev/null
    volumes:
      - ./:/code
```

Please note that the workspace that you run the container on should has a Cargo.toml file under its workspace root directory. Otherwise, the CosmWasm IDE will not display its interface to prevent unexpected errors.

#### 2. Install the CosmWasm IDE extension

You should navigate to the **Extensions** tab in the VS Code tab bar & install the CosmWasm IDE extension. After installing, it should show a new IDE button in the tab bar, as well as several buttons under the Status Bar of VSCode.

#### 3. Build & deploy a contract

Since you are developing locally, you need a wallet to deploy & interact with the contract. Hence, you need to create a **.env** file under the workspace root, and insert your test wallet mnemonic. 

Next, you can choose a file in the src/ directory of your contract then click **Build CosmWasm**. The CosmWasm IDE webview should update its UI, which moves to a new screen so that you can type neccessary inputs to deploy the contract.

Finally, you can click **Upload/Instantiate/Deploy CosmWasm**.

## Deploy to Vscode marketplace

vsce publish --pat $AUTHORIZATION
```

## Deploy to Eclipse Open VSX for Gitpod

```sh
ovsx publish --pat $AUTHORIZATION
```