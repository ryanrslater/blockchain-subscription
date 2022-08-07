import React, { FC, Fragment, useState, FormEvent } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./CreatePost.module.css";
import CircularProgress from "@mui/material/CircularProgress";

import usePost from "../hooks/usePost";

import { users } from "../types/users";
import { tier } from "../types/tier";

type CreatePostProps = {
  profileDetails: users;
  walletKey: string | null;
};

const EditUser: FC<CreatePostProps> = ({ profileDetails, walletKey }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [newUserDetails, setNewUserDetsils] = useState<users>(profileDetails);
  const post = usePost("/api/update-user");
  const toggleModal = () => setOpen(!open);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!walletKey) return;
    await post.newPost({ ...newUserDetails, wallet_key: walletKey });
    if (post.success) {
      setOpen(false);
    }
  };

  return (
    <Fragment>
      <p style={{ cursor: "pointer" }} onClick={toggleModal}>
        Edit user
      </p>
      <Modal open={open} onClose={toggleModal}>
        <Paper className={styles.modalPaper}>
          <div className={styles.createAPost}>Edit your account</div>
          <form onSubmit={submitHandler} className={styles.form}>
            <TextField
              onChange={(e) =>
                setNewUserDetsils((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              value={newUserDetails.first_name}
              sx={{ mb: 2 }}
              fullWidth
              label="First Name"
            />
            <TextField
              onChange={(e) =>
                setNewUserDetsils((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
              value={newUserDetails.last_name}
              fullWidth
              sx={{ mb: 2 }}
              label="Last Name"
            />
            <TextField
              onChange={(e) =>
                setNewUserDetsils((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              value={newUserDetails.title}
              sx={{ mb: 2 }}
              fullWidth
              label="Title"
            />
            <TextField
              onChange={(e) =>
                setNewUserDetsils((prev) => ({ ...prev, slug: e.target.value }))
              }
              value={newUserDetails.slug}
              sx={{ mb: 2 }}
              fullWidth
              label="Slug"
            />
            <TextField
              onChange={(e) =>
                setNewUserDetsils((prev) => ({ ...prev, bio: e.target.value }))
              }
              value={newUserDetails.bio}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              fullWidth
              label="Slug"
            />

            <Button
              type={post.loading ? "button" : "submit"}
              fullWidth
              variant={post.loading ? "outlined" : "contained"}
            >
              {post.loading ? <CircularProgress size="25px" /> : "POST"}
            </Button>
          </form>
        </Paper>
      </Modal>
    </Fragment>
  );
};

export default EditUser;
