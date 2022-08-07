import { Pool } from "pg";
import type { NextApiRequest, NextApiResponse } from "next";
import { users } from "../../types/users";

const checkSlug = async (client: Pool, slug: string, wallet_key: string) => {
  try {
    const query = {
      name: "check-if-slug-exists",
      text: "SELECT wallet_key FROM users WHERE slug = ($1)",
      values: [slug],
    };
    const slugRow = await client.query(query);
    const filteredSlug = slugRow.rows.filter(
      (data) => data.wallet_key !== wallet_key
    );
    if (filteredSlug.length === 0) {
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
  const content: users = req.body;
  const portNum = parseInt(process.env.PGPORT ? process.env.PGPORT : "");
  const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: portNum,
  });
  client.connect();

  const slugCheck = await checkSlug(client, content.slug, content.wallet_key);
  if (!slugCheck) return res.status(500).json({ error: "Slug is not unique" });
  const text =
    "UPDATE users SET first_name = $1, last_name = $2, slug = $3, bio = $4, title = $5, profile_picture = $6, cover_picture = $7 WHERE wallet_key = $8 RETURNING *";
  const values = [
    content.first_name,
    content.last_name,
    content.slug,
    content.bio,
    content.title,
    content.profile_picture,
    content.cover_picture,
    content.wallet_key,
  ];

  try {
    const response = await client.query(text, values);
    if (response.rowCount === 1)
      return res.status(200).json({ res: "success" });
  } catch (err) {
    console.log(err);
    res.status(200).json({ error: err });
  } finally {
    client.end();
  }
}
