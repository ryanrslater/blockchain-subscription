import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState, useEffect } from "react";

import { users } from "../types/users";

function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState<users | null>(null);
  const [walletKey, setWalletKey] = useState<string | null>(null);

  const checkAccount = async () => {
    const { ethereum }: any = window;
    if (ethereum) {
      if (ethereum.selectedAddress) {
        setWalletKey(ethereum.selectedAddress);

        const data = await fetch(`api/get-user/${ethereum.selectedAddress}`);
        const { res } = await data.json();

        if (res.wallet_key) {
          setAccount(res);
        }
      }
    }
  };
  useEffect(() => {
    checkAccount();
  }, [null, walletKey]);

  return (
    <Component
      walletKey={walletKey}
      setWalletKey={setWalletKey}
      account={account}
      setAccount={setAccount}
      {...pageProps}
    />
  );
}

export default MyApp;
