import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { tokenAbi } from "../abis/tokenAbi";
import { Button } from "semantic-ui-react";
import HeaderComponent from "./HeaderComponent";
import GuessNumber from "./GuessNumber";
import TransferTokenComponent from "./TransferTokenComponent";

function HomeComponent({ chainId }) {
  const web3 = new Web3(window.ethereum || window.givenProvider);
  let token;

  console.log("render");
  const [tokenInstance, setTokenInstance] = useState(token);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState("");
  const [tokenETHBalance, setTokenETHBalance] = useState("");

  const [userAddress, setUserAddress] = useState("");
  const [userTokenBalance, setUserTokenBalance] = useState("");
  const [userETHBalance, setUserETHBalance] = useState("");
  const [userDidRequest, setUserDidRequest] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    initContract();
  }, []);

  async function initContract() {
    let contractAddress = "0x54956E74cb8bF3974A7a03Aef313287956E4c254";
    let tokenName;
    let tokenSymbol;
    let tokenDecimals;
    let tokenTotalSupply;
    let tokenETHBalance;
    token = new web3.eth.Contract(tokenAbi, contractAddress);
    tokenName = await token.methods.name().call();
    tokenSymbol = await token.methods.symbol().call();
    tokenDecimals = await token.methods.decimals().call();
    tokenTotalSupply = await token.methods.totalSupply().call();
    tokenETHBalance = await web3.eth.getBalance(contractAddress);
    setTokenInstance(token);
    setTokenName(tokenName);
    setTokenSymbol(tokenSymbol);
    setTokenDecimals(tokenDecimals);
    setTokenTotalSupply(
      parseInt(web3.utils.fromWei(tokenTotalSupply, "ether")).toLocaleString()
    );
    setTokenETHBalance(
      parseFloat(web3.utils.fromWei(tokenETHBalance, "ether")).toLocaleString()
    );
  }

  async function connectUser() {
    if (window.ethereum) {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      initUser();
    }
  }

  async function initUser() {
    if (token && web3) {
      let userAddress;
      let userTokenBalance;
      let userETHBalance;
      let userDidRequest;
      userAddress = await web3.eth.getAccounts();
      userAddress = userAddress[0];
      userTokenBalance = await token.methods.balanceOf(userAddress).call();
      console.log(userTokenBalance);
      userETHBalance = await web3.eth.getBalance(userAddress);
      userDidRequest = await token.methods.tokenRequested(userAddress).call();
      setUserAddress(userAddress);
      setUserTokenBalance(userTokenBalance);
      setUserETHBalance(
        parseFloat(web3.utils.fromWei(userETHBalance, "ether")).toLocaleString()
      );
      setUserDidRequest(userDidRequest);
      setUserLoggedIn(true);
    }
  }

  const updateUserBalances = async () => {
    setUserTokenBalance(
      await tokenInstance.methods.balanceOf(userAddress).call()
    );
    setUserETHBalance(await web3.eth.getBalance(userAddress));
  };
  window.ethereum.on("accountsChanged", (accounts) => {
    initUser();
  });
  return (
    <div>
      {chainId === 80001 ? (
        <HeaderComponent
          chainId={chainId}
          tokenName={tokenName}
          tokenSymbol={tokenSymbol}
          tokenDecimals={tokenDecimals}
          tokenTotalSupply={tokenTotalSupply}
          tokenETHBalance={tokenETHBalance}
          userAddress={userAddress}
          userTokenBalance={userTokenBalance}
          userETHBalance={userETHBalance}
          userDidRequest={userDidRequest}
          userLoggedIn={userLoggedIn}
          tokenInstance={tokenInstance}
          updateUserBalances={updateUserBalances}
        />
      ) : (
        ""
      )}
      {chainId === 80001 && userAddress !== "" ? (
        <GuessNumber tokenInstance={tokenInstance} userAddress={userAddress} />
      ) : (
        ""
      )}
      {chainId === 80001 && userAddress === "" ? (
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            connectUser();
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        ""
      )}

      {chainId !== 80001 ? (
        <div style={{ backgroundColor: "red", color: "white" }}>
          Please connect to Mumbai Testnet
        </div>
      ) : (
        ""
      )}

      <TransferTokenComponent
        token={tokenInstance}
        updateUserBalances={updateUserBalances}
        userAddress={userAddress}
      />
    </div>
  );
}

export default HomeComponent;
