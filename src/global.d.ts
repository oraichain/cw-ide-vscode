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

  type ExecuteOptions = {
    gas?: number;
    fees?: number;
    funds?: string;
    memo?: string;
    mode?: string;
  };

  type ExecuteKeplrOptions = {
    accountNumber: Long | null;
    sequence: number;
    gas: number;
    fees: number;
    mode?: string;
  };

  type StatusCode = {
    SUCCESS: number;
    NOT_FOUND: number;
    GENERIC_ERROR: number;
  };

  type keplrType = keplr;
  interface Window {
    chainStore: ChainStore,
    Keplr: Keplr;
    keplr: keplr;
  }

  declare const APP_SETTINGS: Record<string, any>;
}

export { };
