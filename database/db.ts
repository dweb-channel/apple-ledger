import { createClient } from "npm:@libsql/client/node";
import { drizzle } from "npm:drizzle-orm/libsql";

const sqlite = createClient({
  url: "file:./database/ledger.db",
});

const blockchain = createClient({
  url: "file:./database/blockchain.db",
});

const blockchain_db = drizzle(blockchain);
const db = drizzle(sqlite);

// 区块链数据库
export { blockchain_db, db, sqlite };
