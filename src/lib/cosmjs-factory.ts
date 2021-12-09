import { ChainInfoWithExplorer } from "src/stores/chain";
import CosmJs from "./cosmjs";
import CosmJsAbstract from "./cosmjs-abstract";
import CosmJsLatest from "./cosmjs-latest";

export default class CosmJsFactory {

    private cosmJs: CosmJsAbstract;

    constructor(chain: ChainInfoWithExplorer) {
        if (chain.cosmwasmVersion === "0.16.0" || chain.cosmwasmVersion === "1.0.0") {
            this.cosmJs = new CosmJsLatest();
        } else {
            this.cosmJs = new CosmJs();
        }
    }

    public get current(): CosmJsAbstract {
        return this.cosmJs
    }
}