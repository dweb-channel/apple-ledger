import { sql } from "npm:drizzle-orm";
import { eq } from "npm:drizzle-orm/expressions";
import { integer, sqliteTable, text } from "npm:drizzle-orm/sqlite-core";
import { db } from "../../database/db.ts";

// 用户表
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  autoHash: text("auto_hash").notNull(),
  avatar: text("avatar"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const createUser = async (
  username: string,
  password: string,
  autoHash: string,
) => {
  const res = await db
    .insert(users)
    .values({ username, password, autoHash })
    .returning({ id: users.id })
    .run();

  return Number(res[0].id);
};

export const findUserByUsername = async (username: string) => {
  const result = await db
    .select({
      password: users.password,
      auto_hash: users.autoHash,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result[0] || null;
};

type $UserId = number;
export const findUserByAutoHash = async (
  authHash: string,
): Promise<$UserId | null> => {
  const result = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.autoHash, authHash))
    .limit(1);

  return result[0]?.id || null;
};

export const deleteUserByUsername = async (username: string) => {
  await db
    .delete(users)
    .where(eq(users.username, username));
};

Deno.test("db-user", () => {
  // Run a simple query
  // for (const username of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
  //   createUser(username,"xxx")
  // }
  const row = findUserByUsername("Peter Parker");
  console.log(row);
  // Print out data in table
  // for (const [username,password] of userDb.query("SELECT username FROM users")) {
  //   console.log(username,password);
  // }

  // Close connection
  // userDb.close();
});
