import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Keplr from 'src/lib/Keplr';
import Wasm from 'src/lib/wasm';

// global Wasm
window.Wasm = new Wasm(
    process.env.REACT_APP_LCD || "https://testnet-lcd.orai.io",
    process.env.REACT_APP_NETWORK || "Oraichain-testnet"
);

// export default Keplr;
// global Keplr
window.Keplr = new Keplr(
    process.env.REACT_APP_NETWORK || 'Oraichain-testnet',
    process.env.REACT_APP_RPC_URL || 'http://testnet-rpc.orai.io',
    process.env.REACT_APP_LCD || 'http://testnet-lcd.orai.io',
    'ORAI',
    'orai',
);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
