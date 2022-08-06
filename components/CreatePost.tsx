import React, { FC, Fragment, useState, FormEvent } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./CreatePost.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import usePost from "../hooks/usePost";

import { users } from "../types/users";
import { tier } from "../types/tier";
import { ContentType } from "../types/ContentType";

type CreatePostProps = {
  profileDetails: users;
  tiers: tier[];
  walletKey: string | null;
};

const blankContent: ContentType = {
  title: "",
  body: "",
  image: "",
  tier: 1,
  video: "",
  wallet_key: "",
  id: "",
  timestamp: 0,
};

const CreatePost: FC<CreatePostProps> = ({
  profileDetails,
  tiers,
  walletKey,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<ContentType>(blankContent);
  const post = usePost("/api/create-post");
  const toggleModal = () => setOpen(!open);

  const handleTierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent((prev) => ({ ...prev, tier: parseInt(event.target.value) }));
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!walletKey) return;
    await post.newPost({ ...content, wallet_key: walletKey });
    if (post.success) {
      setOpen(false);
    }
  };
  const tierOptions = tiers.map((el) => (
    <FormControlLabel
      key={el.tier}
      value={el.tier}
      control={<Radio />}
      label={el.title}
    />
  ));
  return (
    <Fragment>
      <Paper className={styles.createPostWrapper}>
        <Avatar src={profileDetails.profile_picture} />
        <div className={styles.createPostButton} onClick={toggleModal}>
          <p>Start a post</p>
        </div>
      </Paper>
      <Modal open={open} onClose={toggleModal}>
        <Paper className={styles.modalPaper}>
          <div className={styles.createAPost}>Create a post</div>
          <form onSubmit={submitHandler} className={styles.form}>
            <TextField
              onChange={(e) =>
                setContent((prev) => ({ ...prev, title: e.target.value }))
              }
              value={content.title}
              sx={{ mb: 2 }}
              fullWidth
              label="Post Title"
            />
            <TextField
              onChange={(e) =>
                setContent((prev) => ({ ...prev, body: e.target.value }))
              }
              value={content.body}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              placeholder="What do you want to say?"
            />
            <TextField
              onChange={(e) =>
                setContent((prev) => ({ ...prev, image: e.target.value }))
              }
              value={content.image}
              sx={{ mb: 2 }}
              fullWidth
              label="Image"
            />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Tier
              </FormLabel>
              <RadioGroup
                row
                value={content.tier}
                onChange={handleTierChange}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                {tierOptions}
              </RadioGroup>
            </FormControl>
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

export default CreatePost;
