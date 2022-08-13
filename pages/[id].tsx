import type { NextPage, GetServerSideProps } from "next";
import React from "react";

import { Client, Pool } from "pg";

import ContentCreator from "../layouts/ContentCreator";

import RegularProfile from "../layouts/RegularProfile";
import { users } from "../types/users";
import { tier } from "../types/tier";
import { ContentType } from "../types/ContentType";

type UserPageProps = {
  walletKey: string | null;
  setWalletKey: (key: string | null) => void;
  account: users | null;
  setAccount: (state: users | null) => void;
  profileDetails: users;
  tiers: tier[];
  content: ContentType[];
};

const UserPage: NextPage<UserPageProps> = ({
  profileDetails,
  account,
  walletKey,
  setWalletKey,
  tiers,
  content,
  setAccount,
}) => {
  if (profileDetails.content_creator) {
    return (
      <ContentCreator
        walletKey={walletKey}
        setWalletKey={setWalletKey}
        account={account}
        setAccount={setAccount}
        profileDetails={profileDetails}
        tiers={tiers}
        content={content}
      />
    );
  }
  return (
    <RegularProfile
      walletKey={walletKey}
      setWalletKey={setWalletKey}
      account={account}
      setAccount={setAccount}
      profileDetails={profileDetails}
      tiers={tiers}
      content={content}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const portNum = parseInt(process.env.PGPORT ? process.env.PGPORT : "");
  const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: portNum,
  });
  client.connect();
  const userQuery = {
    name: "fetch-user",
    text: "SELECT * FROM users WHERE slug = ($1)",
    values: [id],
  };
  try {
    const user = await client.query(userQuery);

    let tiers = null;
    let content = null;
    if (user.rowCount > 0) {
      const tierQuery = {
        name: "fetch-tier",
        text: "SELECT * FROM tiers WHERE wallet_key = ($1)",
        values: [user.rows[0].wallet_key],
      };
      const contentQuery = {
        name: "fetch-content",
        text: "SELECT * FROM content WHERE wallet_key = ($1) ORDER BY content.timestamp DESC",
        values: [user.rows[0].wallet_key],
      };
      tiers = await client.query(tierQuery);
      content = await client.query(contentQuery);
    }

    return {
      props: {
        profileDetails: user.rows[0],
        tiers: tiers ? tiers.rows : [],
        content: content ? content.rows : [],
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: { error: "error" },
    };
  } finally {
    client.end();
  }
};

export default UserPage;
