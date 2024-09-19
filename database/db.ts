import { createClient } from 'npm:@libsql/client/node';
import { drizzle } from 'npm:drizzle-orm/libsql';

const sqlite = createClient({
  url: "file:./database/ledger.db"
})

const db = drizzle(sqlite);
export {
  db, sqlite
};
