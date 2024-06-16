import db from "../../database/db.ts";

export const addBlockToDB = (
  userId: number,
  timestamp: string,
  previousHash: string,
  hash: string
) => {
  db.query(
    `UPDATE ledgers SET timestamp = ?, previousHash = ?, hash = ? WHERE user_id = ?`,
    [timestamp, previousHash, hash, userId]
  );
};
