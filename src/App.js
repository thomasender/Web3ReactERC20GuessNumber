import React, { useState, useEffect } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import HomeComponent from "./components/HomeComponent";
import Web3 from "web3";

function App() {
  const [hasWeb3, setHasWeb3] = useState(false);
  const [chainId, setChainId] = useState();

  const initWeb3 = async () => {
    if (window.ethereum) {
      let web3Instance;
      let chainId;
      web3Instance = new Web3(window.ethereum || window.givenProvider);
      chainId = await web3Instance.eth.getChainId();
      setChainId(chainId);
      setHasWeb3(true);
    }
    if (!window.ethereum) {
      setHasWeb3(false);
      alert("No Web3 Provider detected. Consider installing MetaMask!");
    }
  };

  useEffect(() => {
    initWeb3();
  }, []);

  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  return (
    <div className="App">
      {hasWeb3 === true ? (
        <HomeComponent chainId={chainId} />
      ) : (
        "No Web3 Provider detected! Please consider installing Metamask"
      )}
    </div>
  );
}

export default App;
