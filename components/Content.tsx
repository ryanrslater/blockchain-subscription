import React, { FC } from "react";

import styles from "./Content.module.css";
import Paper from "@mui/material/Paper";
import LockIcon from "@mui/icons-material/Lock";
import { Permissions } from "../types/Permissions";
import { ContentType } from "../types/ContentType";

type ContentProps = {
  permissions: Permissions | null;
  content: ContentType;
};

const Content: FC<ContentProps> = ({ permissions, content }) => {
  if (!permissions) {
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.lockedWrapper}>
          <LockIcon />
        </div>
        <h6 className={styles.lockedReason}>Subscribe to get access</h6>
      </div>
    );
  }
  if (permissions.timestamp > new Date().getTime()) {
    return (
      <div className={styles.contentWrapper}>
        <div className={styles.lockedWrapper}>
          <LockIcon />
        </div>
        <h6 className={styles.lockedReason}>Your subscription has expired</h6>
      </div>
    );
  }

  return (
    <Paper>
      {content.tier > permissions.tier ? (
        <div className={styles.contentWrapper}>
          <div className={styles.lockedWrapper}>
            <LockIcon />
          </div>
          <h6 className={styles.lockedReason}>
            You don&apos;t have access to this tier
          </h6>
        </div>
      ) : (
        <div className={styles.contentWrapper}>
          <h4>{content.title}</h4>
          <p>{content.body}</p>
        </div>
      )}
    </Paper>
  );
};

export default Content;
