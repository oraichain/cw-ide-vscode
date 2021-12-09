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
    async handleDeploy(_args: any): Promise<any> {
        throw new Error("Method 'handleDeploy()' must be implemented.");
    }
    async query(_address: string, _queryMsg: string): Promise<any> {
        throw new Error("Method 'query()' must be implemented.");
    }
    async execute(_args: { mnemonic: string, address: string, handleMsg: string, memo?: string, amount?: any, gasAmount: { amount: string, denom: string }, fees?: number }): Promise<any> {
        throw new Error("Method 'execute()' must be implemented.");
    }
}