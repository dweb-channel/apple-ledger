import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

const db = new DB("./database/ledger.db");

export default db;