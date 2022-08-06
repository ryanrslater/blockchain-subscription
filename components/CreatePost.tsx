import React, { FC, Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "./CreatePost.module.css";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { users } from "../types/users";
import { tier } from "../types/tier";

type CreatePostProps = {
  profileDetails: users;
  tiers: tier[];
};

const CreatePost: FC<CreatePostProps> = ({ profileDetails, tiers }) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleModal = () => setOpen(!open);
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
          <form className={styles.form}>
            <TextField sx={{ mb: 2 }} fullWidth label="Post Title" />
            <TextField
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
              placeholder="What do you want to say?"
            />
            <TextField sx={{ mb: 2 }} fullWidth label="Image" />
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Tier
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                {tierOptions}
              </RadioGroup>
            </FormControl>
            <Button fullWidth variant="contained">
              POST
            </Button>
          </form>
        </Paper>
      </Modal>
    </Fragment>
  );
};

export default CreatePost;
