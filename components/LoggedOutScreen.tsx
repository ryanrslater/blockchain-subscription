import React, { FC } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

type LoggedOutScreenProps = {
  walletKey: string | null;
  setWalletKey: (state: string | null) => void;
};

const LoggedOutScreen: FC<LoggedOutScreenProps> = ({
  walletKey,
  setWalletKey,
}) => {
  const connectHandler = async () => {
    const { ethereum }: any = window;
    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setWalletKey(account);
    }
  };
  return (
    <div style={{ backgroundColor: "#F0F2F5", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div style={{ width: "500px" }}>
          <h2>Blockchain Subscription App</h2>
          <h4>
            Using decenteralised technologies to provide faster payments to
            content creators
          </h4>
        </div>
        <Paper sx={{ p: 3, width: "400px" }}>
          <h4>Connect your wallet to get started!</h4>
          <p>
            Don&apos;t have a wallet? we recommend{" "}
            <a rel="noreferrer" href="https://metamask.io/" target="_blank">
              MetaMask
            </a>
            , download the extentsion, set up your account and you are ready to
            go!
          </p>
          <Button onClick={connectHandler} variant="contained" fullWidth>
            Connect your wallet
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default LoggedOutScreen;
