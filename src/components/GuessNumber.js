import React, { useState } from "react";
import Web3 from "web3";
import { Card, Input, Button } from "semantic-ui-react";

function GuessNumber({ tokenInstance, userAddress }) {
  const web3 = new Web3(window.ethereum);
  const [guess, setGuess] = useState(0);

  console.log(tokenInstance.methods);
  const guessHandler = (e) => {
    setGuess(e.target.value.toString());
  };
  const guessNumber = async () => {
    const randomNumber = Math.floor(Math.random() * 11);
    if (isNaN(guess) || guess > 10) {
      alert("Please enter a valid number!");
    } else if (guess === randomNumber.toString()) {
      alert("You WIN 0.1 MATIC! Sign the transaction to receive your reward!");
      let amount = web3.utils.toWei("0.1", "ether");
      await tokenInstance.methods.payout(amount).send({ from: userAddress });
    } else {
      alert(
        "Wrong! Your guess: " +
          guess +
          " Winning number: " +
          randomNumber +
          " Try again!"
      );
    }
  };

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          Guess a number between 0 and 10 and win 0.1 Matic!
        </Card.Header>
        <Input placeholder="Guess between 0 and 10" onChange={guessHandler} />
        <Button onClick={guessNumber}>Guess!</Button>
      </Card.Content>
    </Card>
  );
}

export default GuessNumber;
