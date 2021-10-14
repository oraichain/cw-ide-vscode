import * as vscode from 'vscode';
import init from './init';
import { CosmWasmViewProvider } from './webview-provider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new CosmWasmViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CosmWasmViewProvider.viewType,
      provider
    )
  );

  init(context, provider);
}

// this method is called when your extension is deactivated
export function deactivate() {}

// Denotes the state or progress the workspace is currently in.
export type WorkspaceProgress =
  | { state: 'progress'; message: string }
  | { state: 'ready' | 'standby' };

/**
 * A wrapper around a value of type `T` that can be subscribed to whenever the
 * underlying value changes.
 */
export class Observable<T> {
  private _listeners: Set<(arg: T) => void> = new Set();
  private _value: T;
  /** Returns the current value. */
  get value() {
    return this._value;
  }
  /** Every change to the value triggers all the registered callbacks. */
  set value(value: T) {
    this._value = value;
    this._listeners.forEach((fn) => fn(value));
  }

  constructor(value: T) {
    this._value = value;
  }

  /**
   * Registers a listener function that's called whenever the underlying value
   * changes.
   * @returns a function that unregisters the listener when called.
   */
  public observe(fn: (arg: T) => void): vscode.Disposable {
    this._listeners.add(fn);

    return { dispose: () => this._listeners.delete(fn) };
  }
}
