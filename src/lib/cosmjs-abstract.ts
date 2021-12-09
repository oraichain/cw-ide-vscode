import { ChainInfoWithExplorer } from "src/stores/chain";
import CosmJs from "./cosmjs";
import CosmJsLatest from "./cosmjs-latest";

/**
 * Abstract Class CosmJsAbstract.
 *
 * @class CosmJsAbstract
 */
export default class CosmJsAbstract {
    constructor() {
        if (this.constructor == CosmJsAbstract) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    async handleDeploy(args: any): Promise<any> {
        throw new Error("Method 'handleDeploy()' must be implemented.");
    }
    async query(address: string, queryMsg: string): Promise<any> {
        throw new Error("Method 'query()' must be implemented.");
    }
    async execute(args: { mnemonic: string, address: string, handleMsg: string, memo?: string, amount?: any, gasAmount: { amount: string, denom: string }, fees?: number }): Promise<any> {
        throw new Error("Method 'execute()' must be implemented.");
    }
}