# Welcome to CosmWasm VS Code Extension

<p align="center">
  <a href="https://orai.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://gateway.ipfs.io/ipfs/QmQkiBbB3DNZAjk4Fe1fY1CAyv2xdW189yHKJZiCAKZU64" alt="CosmWasm IDE logo"></a> &nbsp
  <a href="https://orai.io" target="_blank" rel="noopener noreferrer"><img width="100" src="https://avatars.githubusercontent.com/u/69910226?s=200&v=4" alt="Oraichain logo"></a>
</p>

<h1 align="center">
    CosmosWasm IDE - An open-source project for CosmWasm smart contract developers  
</h1>

## cosmwasm-simulate

cosmwasm-simulate is developed for Cosmwasm Smart Contract system, the main functions is:

- Fast load & deploy & hot-reload contract without run WASMD
- Fast call contract interface via command & switch contract, account
- Fast Dapp development via Restful API & already integrated with Oraichain Studio
- Print some debug information on screen
- Do some bytecode check during wasm instanced
- Watching storage db change on realtime
- Dynamic calcuate and printing gas used during contract execute
- Easy to test smart contract without input a json string

## cosmWasm-optimize

This is a bash script with a locked set of dependencies to produce
reproducible builds of cosmwasm smart contracts. It also does heavy
optimization on the build size, using binary stripping and `wasm-opt`.

## cosmwasm-vscode interface

The extension provides two custom VS Code buttons: ```Build CosmWasm``` and ```Simulate Cosmwasm``` under the status bar of Vs Code. The ```Build CosmWasm``` button will build the smart contract to the .wasm file based on the file you open in VS Code. Meanwhile, the ```Simulate Cosmwasm``` button will start a new simulate session using the contract file that is currently opened.

The extension also includes a new side bar called: ```CosmWasm Interaction```, which is a React application allowing users to deploy and interact with the smart contracts through a specific Cosmos-based network using Wasmd.