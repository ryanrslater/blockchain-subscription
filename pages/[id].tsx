import type { NextPage, GetServerSideProps } from "next";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Client, Pool } from "pg";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";

import Tiers from "../components/Tiers";
import Content from "../components/Content";
import CreatePost from "../components/CreatePost";
import TopNavigationBar from "../components/TopNavigationBar";
import EditUser from "../components/EditUser";
import contract from "../contracts/contract";

import { users } from "../types/users";
import { tier } from "../types/tier";
import { Permissions } from "../types/Permissions";
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
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const TierPricing = tiers.map((el: tier, index: number) => {
    if (!profileDetails) return;
    return (
      <Tiers
        tier={index + 1}
        creator={profileDetails.wallet_key}
        subscriber={walletKey}
        key={el.title}
        title={el.title}
        description={el.body}
        price={el.price}
      />
    );
  });

  const contentMapped = content.map((el: ContentType, i: number) => (
    <Content content={el} key={i} permissions={permissions} />
  ));

  const checkPermissions = async () => {
    if (!profileDetails) return;
    const data = await contract.methods
      .Subscriptions(walletKey, profileDetails.wallet_key)
      .call();
    setLoading(false);
    console.log(data);
    setPermissions({
      amount: data.amount,
      tier: data.tier,
      timestamp: parseInt(data.timestamp),
    });
  };
  useEffect(() => {
    if (walletKey) checkPermissions();
    if (!walletKey) setLoading(false);
  }, [walletKey]);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNavigationBar walletKey={walletKey} setWalletKey={setWalletKey} />
      <div
        style={
          profileDetails && {
            backgroundImage: `url("${profileDetails.cover_picture}")`,
            height: "350px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }
        }
      />
      <Grid sx={{ pt: 2, backgroundColor: "#F0F2F5" }} container spacing={2}>
        <Grid xs={4} item>
          {profileDetails && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  width: "60%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{ width: 56, height: 56 }}
                  src={profileDetails.profile_picture}
                />
                <h4>{profileDetails.title}</h4>
                <p style={{ textAlign: "center" }}>{profileDetails.bio}</p>
                {walletKey === profileDetails.wallet_key && (
                  <EditUser
                    walletKey={walletKey}
                    profileDetails={profileDetails}
                  />
                )}
              </div>
            </div>
          )}
        </Grid>
        <Grid xs={4} item>
          {profileDetails.wallet_key === walletKey && (
            <CreatePost
              walletKey={walletKey}
              tiers={tiers}
              profileDetails={profileDetails}
            />
          )}
          <div
            style={{
              paddingTop: "10px",
            }}
          >
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                }}
              >
                <CircularProgress />
              </div>
            )}
            <Collapse in={!loading}>
              <div>{contentMapped}</div>
            </Collapse>
          </div>
        </Grid>
        <Grid xs={4} item>
          <div style={{ width: "60%" }}>
            <div
              style={{
                border: "1px solid #dbdbdb",
                borderRadius: "4px",
                padding: "10px",
              }}
            >
              {TierPricing}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
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
