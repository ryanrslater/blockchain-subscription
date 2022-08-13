import React, { FC } from "react";
import TopNavigationBar from "../components/TopNavigationBar";
import { users } from "../types/users";
import { tier } from "../types/tier";
import { Permissions } from "../types/Permissions";
import { ContentType } from "../types/ContentType";

import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

type RegularProfileProps = {
  walletKey: string | null;
  setWalletKey: (key: string | null) => void;
  account: users | null;
  setAccount: (state: users | null) => void;
  profileDetails: users;
  tiers: tier[];
  content: ContentType[];
};

const RegularProfile: FC<RegularProfileProps> = ({
  profileDetails,
  account,
  walletKey,
  setWalletKey,
  tiers,
  content,
  setAccount,
}) => {
  return (
    <div>
      <TopNavigationBar
        account={account}
        walletKey={walletKey}
        setWalletKey={setWalletKey}
      />
      <Paper sx={{ m: "10% auto ", p: "20px", width: "90%" }}>
        <Avatar src={profileDetails.profile_picture} />
      </Paper>
    </div>
  );
};

export default RegularProfile;
