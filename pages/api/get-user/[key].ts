// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Client } from "pg";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const portNum = parseInt(process.env.PGPORT ? process.env.PGPORT : "");
  const { key } = req.query;
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: portNum,
  });
  client.connect();

  const query = {
    name: "fetch-user-details",
    text: "SELECT * FROM users WHERE wallet_key = $1",
    values: [key],
  };
  try {
    const data = await client.query(query);

    const response = data.rows[0];

    res.status(200).json({ res: response });
  } catch (err) {
    res.status(500).json({ error: err });
  } finally {
    client.end();
  }
};

export default handler;
