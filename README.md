# Welcome to CosmWasm VS Code Extension

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
