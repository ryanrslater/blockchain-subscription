import type { NextPage } from "next";
import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
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

type ContentCreatorProps = {
  walletKey: string | null;
  setWalletKey: (key: string | null) => void;
  account: users | null;
  setAccount: (state: users | null) => void;
  profileDetails: users;
  tiers: tier[];
  content: ContentType[];
};

const ContentCreator: NextPage<ContentCreatorProps> = ({
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
      <TopNavigationBar
        account={account}
        walletKey={walletKey}
        setWalletKey={setWalletKey}
      />
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
      <Grid sx={{ pt: 2 }} container spacing={2}>
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

export default ContentCreator;