import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState, useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [account, setAccount] = useState<string | null>(null);
  const checkAccount = async () => {
    const { ethereum }: any = window;
    if (ethereum) {
      if (ethereum.selectedAddress) return setAccount(ethereum.selectedAddress);
    }
  };
  useEffect(() => {
    checkAccount();
  }, []);
  return <Component account={account} setAccount={setAccount} {...pageProps} />;
}

export default MyApp;
