import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { drizzle } from "npm:drizzle-orm/better-sqlite3/driver";

const sqlite =new DB("./database/ledger.db");

const db = drizzle(sqlite);
export {
  db, sqlite
};
