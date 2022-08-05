export interface RunButton {
  cwd?: string;
  command: string;
  vsCommand: string;
  singleInstance?: boolean;
  id: string;
  name: string;
  color: string;
}

export interface Version {
  OLD_VERSION: string;
  NEW_VERSION: string;
};

declare global {
  interface Window {
    keplr: any;
  }
}