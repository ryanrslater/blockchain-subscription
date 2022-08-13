import { Pool } from "pg";
import type { NextApiRequest, NextApiResponse } from "next";
import { users } from "../../types/users";

const checkWallet = async (client: Pool, wallet_key: string) => {
  try {
    const query = {
      name: "check-if-wallet-exists",
      text: "SELECT count(*) FROM users WHERE wallet_key = ($1)",
      values: [wallet_key],
    };

    const walletRow = await client.query(query);

    if (walletRow.rows[0].count === "0") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user: users = req.body.user;
  const walletKey = req.body.walletKey;
  const newUser: users = {
    first_name: user.first_name,
    last_name: user.last_name,
    wallet_key: walletKey,
    slug: walletKey,
    bio: "",
    title: user.title,
    profile_picture: "",
    cover_picture: "",
    content_creator: false,
    banned: false,
    email: user.email,
  };
  const portNum = parseInt(process.env.PGPORT ? process.env.PGPORT : "");
  const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: portNum,
  });
  client.connect();

  const walletCheck = await checkWallet(client, walletKey);

  console.log("here", walletCheck);
  if (!walletCheck)
    return res.status(500).json({ error: "Account already exists" });
  const newValues = Object.values(newUser);
  const text =
    "INSERT INTO users(first_name, last_name, wallet_key, slug, bio, title, profile_picture, cover_picture, content_creator, banned, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

  try {
    const response = await client.query(text, newValues);
    console.log(response);
    if (response.rowCount === 1)
      return res.status(200).json({ res: "success", data: response });
  } catch (err) {
    console.log(err);
    res.status(200).json({ error: err });
  } finally {
    client.end();
  }
}
