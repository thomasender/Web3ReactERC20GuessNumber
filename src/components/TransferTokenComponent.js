import React, { useState } from "react";
import { Input, Card, Button } from "semantic-ui-react";
import Web3 from "web3";

function TransferTokenComponent({ token, updateUserBalances, userAddress }) {
  const web3 = new Web3(window.ethereum || window.givenProvider);
  const [recipient, setRecipient] = useState();
  const [amount, setAmount] = useState();
  const [isBusy, setIsBusy] = useState(false);

  const transferTokens = async () => {
    if (isNaN(amount)) {
      alert("Please enter a valid number!");
    }
    if (web3.utils.isAddress(recipient) === false) {
      alert("Please enter a valid address!");
    }
    if (!isNaN(amount) && web3.utils.isAddress(recipient)) {
      setIsBusy(true);
      await token.methods
        .transfer(recipient, amount)
        .send({ from: userAddress })
        .on("receipt", (receipt) => {
          setIsBusy(false);
          updateUserBalances();
        })
        .on("error", (error) => {
          setIsBusy(false);
          alert("There was an error:" + error.message);
          console.error(error);
        });
    }
  };

  return (
    <Card>
      <Card.Content>
        <Card.Header>Transfer MTNT Tokens</Card.Header>
        <Input
          placeholder="Recipient Address"
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          placeholder="Amount in MTNT"
          onChange={(e) => setAmount(e.target.value)}
        />
        {isBusy === true ? (
          <Button loading>Transfer</Button>
        ) : (
          <Button onClick={transferTokens}>Transfer</Button>
        )}
      </Card.Content>
    </Card>
  );
}

export default TransferTokenComponent;
