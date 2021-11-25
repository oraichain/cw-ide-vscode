import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Keplr from 'src/lib/Keplr';
import { ChainStore } from './stores/chain';
import { EmbedChainInfos } from './config';

window.chainStore = new ChainStore(EmbedChainInfos);

// export default Keplr;
// global Keplr
// window.Keplr = new Keplr();

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
