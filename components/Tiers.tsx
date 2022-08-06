import React, { FC } from "react";

import Web3 from "web3";

import styles from "./Tiers.module.css";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import contract from "../contracts/contract";

type TierProps = {
  title: string;
  description: string;
  price: string;
  tier: number;
  subscriber: string | null;
  creator: string;
};
const Tiers: FC<TierProps> = ({
  title,
  description,
  price,
  tier,
  subscriber,
  creator,
}) => {
  const clickHandler = async () => {
    await contract.methods
      .subcribeToCreator(tier, creator)
      .send({ from: subscriber, value: Web3.utils.toWei(price) });
  };
  return (
    <Paper className={styles.tiersWrapper}>
      <h4 className={styles.tierTitle}>{title}</h4>
      <Divider />
      <p className={styles.tierDescription}>{description}</p>
      <p>{price} Eth</p>
      <Button
        variant="contained"
        fullWidth
        disabled={!subscriber}
        onClick={clickHandler}
      >
        Subscribe
      </Button>
    </Paper>
  );
};

export default Tiers;
