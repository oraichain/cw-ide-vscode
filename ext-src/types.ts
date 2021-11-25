export interface RunButton {
  cwd?: string;
  command: string;
  vsCommand: string;
  singleInstance?: boolean;
  id: string;
  name: string;
  color: string;
}

declare global {
  interface Window {
    keplr: any;
  }
}