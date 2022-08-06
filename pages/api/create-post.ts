import { Pool } from "pg";
import type { NextApiRequest, NextApiResponse } from "next";
import { ContentType } from "../../types/ContentType";

const generateId = async (client: Pool) => {
  var id;
  id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 20);

  try {
    const query = {
      name: "check-if-id-exists",
      text: "SELECT count(id) FROM content WHERE id = ($1)",
      values: [id],
    };
    const idNum = await client.query(query);
    return { id, idNum: idNum.rows[0].count };
  } catch (err) {
    console.log(err);
    return { id: "NA", idNum: 0 };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const content: ContentType = req.body;
  const portNum = parseInt(process.env.PGPORT ? process.env.PGPORT : "");
  const client = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: portNum,
  });
  client.connect();

  const createNewIdRecurrsion = async () => {
    let { id, idNum } = await generateId(client);

    if (id == "NA")
      return res.status(500).json({ error: "error generating id" });
    if (idNum > 0) createNewIdRecurrsion();
    return id;
  };
  const newId = await createNewIdRecurrsion();
  console.log(new Date().getTime());
  const text =
    "INSERT INTO content(title, tier, body, image, video, wallet_key, id, timestamp) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
  const values = [
    content.title,
    content.tier,
    content.body,
    content.image,
    content.video,
    content.wallet_key,
    newId,
    new Date().getTime(),
  ];
  if (!newId) return res.status(200).json({ error: "No new id" });

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
