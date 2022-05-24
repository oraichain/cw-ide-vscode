# Welcome to CosmWasm IDE Extension

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/cosmos-ide.png" alt="CosmWasm IDE logo"></a> &nbsp
  <a href="https://orai.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://raw.githubusercontent.com/oraichain/vscode-cosmwasm/docs/contributing/public/logo-128.png" alt="Oraichain logo"></a>
</p>

<h1 align="center">
    CosmosWasm IDE - An open-source project for CosmWasm smart contract developers  
</h1>

## 1. Setting up the CosmWasm development environment

### Gitpod users

To setup your workspace with all the neccessary tools & libraries for developing the CosmWasm smart contracts, please click button ```Open in Gitpod``` below. Gitpod will automatically install everything you need to deploy a smart contract.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/oraichain/cosmwasm-gitpod)

### Local development users

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

## 2. Install the CosmWasm IDE extension (for local development users only)

You should navigate to the **Extensions** tab in the VS Code tab bar & install the CosmWasm IDE extension. After installing, it should show a new IDE button in the tab bar, as well as several buttons under the Status Bar of VSCode.

## 3. Build & deploy a contract

- Since you are developing locally, you need a wallet to deploy & interact with the contract. Hence, you need to create a **.env** file under the workspace root, and insert your test wallet mnemonic. 

- Next, choose an arbitrary file in the project.

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="600" src="https://raw.githubusercontent.com/oraichain/cosmwasm-gitpod/master/docs/assets/choose-a-file.png" alt="Choose a project file"></a>
</p>

<h4 align="center">
    An example of choosing a project file
</h4>

- Then, please click **Build Cosmwasm** to build the smart contract.

* Note: The extension provides four custom VS Code buttons: ```Build CosmWasm```,  ```Deploy CosmWasm```, ```Upload CosmWasm``` and ```Instantiate CosmWasm``` under the status bar of Vs Code and a ```CosmWasm IDE Explorer``` under the ```Explorer``` tab of VS Code.

  - ```Build CosmWasm``` button will build the smart contract to the .wasm file based on the file you open in VS Code.
  - ```Deploy Cosmwasm``` button will deploy your contract onto a network that you choose on the CosmWasm IDE explorer.
  - ```Upload CosmWasm``` button will upload your smart contract code.
  - ```Instantiate CosmWasm``` button will instantiate your smart contract given a code id.

* Please note that the IDE will read all the json schemas of a project from the location **artifacts/schema** or **schema**. As a result, if the schemas are in a different location, the IDE will not be able to move to the next stage.

- After finishing building, the CosmWasm IDE should move to a new page with basic information for contract deployment like in the image below.

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="300" src="https://raw.githubusercontent.com/oraichain/cosmwasm-gitpod/master/docs/assets/interact.png" alt="contract interaction"></a>
</p>

<h4 align="center">
    Contract interaction with VsCode CosmWasm extension
</h4>

- After filling all the needed information, you can click **Deploy / Upload / Instantiate CosmWasm** to to deploy / upload / instantiate the contract.

## 4. Interacting with the IDE webview

After deploying or instantiating, the webview will display the deployed contract address & two interaction options: Execute & Query. You can freely play with it to suit your needs.

<p align="center">
  <a target="_blank" rel="noopener noreferrer"><img width="300" src="https://raw.githubusercontent.com/oraichain/cosmwasm-gitpod/master/docs/assets/interaction.png" alt="contract interaction"></a>
</p>
```