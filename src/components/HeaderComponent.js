import React, { useState, useEffect } from "react";
import { Button, Header, Icon, Segment, Grid, Card } from "semantic-ui-react";
import Web3 from "web3";

function HeaderComponent({
  chainId,
  tokenName,
  tokenSymbol,
  tokenDecimals,
  tokenTotalSupply,
  tokenETHBalance,
  userAddress,
  userTokenBalance,
  userETHBalance,
  userDidRequest,
  userLoggedIn,
  tokenInstance,
  updateUserBalances,
}) {
  // const [userTokBalance, setUserTokBalance] = useState(userTokenBalance);
  // const [userETHBal, setUserETHBal] = useState(userETHBalance);
  const web3 = new Web3(window.ethereum);
  return (
    <div>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
            <Card fluid color="blue">
              <Card.Header>Token Data</Card.Header>
              <Card.Meta>
                <p>NetworkId {chainId}</p>
              </Card.Meta>
              <Card.Content>
                <p>Contract MATIC Balance: {tokenETHBalance}</p>
                <p>Total Token Supply: {tokenTotalSupply}</p>
                <p>Token Decimals: {tokenDecimals}</p>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid color="teal">
              <Card.Header>{tokenName}</Card.Header>
              <Card.Meta>{tokenSymbol}</Card.Meta>
              <Card.Description>
                An ERC20 Token on Mumbai Testnet
              </Card.Description>
              {userAddress !== "" ? (
                <Card.Content>Welcome {userAddress}</Card.Content>
              ) : (
                <Card.Content>
                  Welcome Guest, Please connect your wallet.
                </Card.Content>
              )}
              {userAddress !== "" ? (
                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.reload();
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                ""
              )}
            </Card>
          </Grid.Column>
          <Grid.Column>
            <Card fluid color="red">
              <Card.Header>Your Balances:</Card.Header>
              <Card.Meta>MTNT & MATIC</Card.Meta>
              <Card.Content>
                <p>
                  {tokenSymbol}: {userTokenBalance}
                </p>
                <p>MATIC: {userETHBalance}</p>
                {userDidRequest === true || userLoggedIn === false ? (
                  ""
                ) : (
                  <Button
                    type="submit"
                    onClick={async (e) => {
                      e.preventDefault();
                      await tokenInstance.methods
                        .payToken()
                        .send({ from: userAddress })
                        .on("receipt", async (receipt) => {
                          updateUserBalances();
                          // setUserTokenBalance(
                          //   await tokenInstance.methods
                          //     .balanceOf(userAddress)
                          //     .call()
                          // );
                          // setUserETHBal(await web3.eth.getBalance(userAddress));
                        })
                        .on("error", (error) => {
                          console.error(error);
                        });
                    }}
                  >
                    Claim 1000 FREE MTNT Tokens! (one time only)
                  </Button>
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default HeaderComponent;
