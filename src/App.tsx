import { useEffect, useState } from 'react';
import './App.css';

import logo from './logo.png';

const vscode = acquireVsCodeApi();

const App = () => {
  const [action, setAction] = useState();
  // Handle messages sent from the extension to the webview
  const eventHandler = (event: MessageEvent) => {
    const message = event.data; // The json data that the extension sent
    setAction(message);
    vscode.postMessage(`from UI: ${message}`);
  };

  useEffect(() => {
    window.addEventListener('message', eventHandler);
    return () => {
      window.addEventListener('message', eventHandler);
    };
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to CosmWasm Interaction</h1>
      </header>
      <p className="App-intro">
        Action called: <br />
        <code className="ellipsis">{action}</code>
      </p>
    </div>
  );
};

export default App;
