import React, { useState } from "react";

import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import usePost from "../hooks/usePost";

import { users } from "../types/users";

const blankUser: users = {
  first_name: "",
  last_name: "",
  wallet_key: "",
  slug: "",
  bio: "",
  title: "",
  profile_picture: "",
  cover_picture: "",
  content_creator: false,
  banned: false,
  email: "",
};

const AccountCreation = () => {
  const [userDetails, setUserDetails] = useState<users>(blankUser);
  const post = usePost("");
  return (
    <div style={{ backgroundColor: "#F0F2F5", height: "100vh" }}>
      <div style={{ paddingTop: "10%" }}>
        <Paper sx={{ width: "80%", m: "0 auto", p: 2 }}>
          <h4>Create your account</h4>
          <p>In order to make the most out of the app, create your account</p>
          <TextField
            label="First Name"
            sx={{ mb: 2 }}
            value={userDetails.first_name}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Last Name"
            sx={{ mb: 2 }}
            value={userDetails.last_name}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Username"
            sx={{ mb: 2 }}
            value={userDetails.title}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Email"
            sx={{ mb: 2 }}
            type="email"
            value={userDetails.email}
            onChange={(e) =>
              setUserDetails((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            fullWidth
          />
          <Button fullWidth variant="contained">
            Create Account
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default AccountCreation;
