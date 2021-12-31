import { BroadCastMode } from '@oraichain/cosmosjs';
import Keplr from './lib/Keplr';
import { Keplr as keplr } from './types/kelpr/wallet';
import Wasm from './lib/wasm';
import { ChainStore } from './stores/chain';

declare global {
  type VSCode = {
    postMessage(message: any): void;
    getState(): any;
    setState(state: any): void;
  };

  declare const vscode: VSCode;

  function acquireVsCodeApi(): VSCode;

  declare const APP_SETTINGS: Record<string, any>;
}

export { };
