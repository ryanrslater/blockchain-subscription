import React, { FC } from "react";

import styles from "./Content.module.css";

import LockIcon from "@mui/icons-material/Lock";

type Permissions = { amount: string; tier: string; timestamp: number };
type ContentPropsType = {
  title: string;
  body: string;
  image: string;
  tier: string;
};
type ContentProps = {
  permissions: Permissions | null;
  content: ContentPropsType;
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
  const requiredTied = parseInt(content.tier);
  const subscribersTier = parseInt(permissions.tier);
  return (
    <div>
      {requiredTied > subscribersTier ? (
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
    </div>
  );
};

export default Content;
