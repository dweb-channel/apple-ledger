import db from "../../database/db.ts";

export const createUser = (
  username: string,
  password: string,
  auto_hash: string
) => {
  db.query(
    "INSERT INTO users (username, password,auto_hash) VALUES (?, ?, ?)",
    [username, password, auto_hash]
  );
};

type password = string;
type auto_hash = string;
export const findUserByUsername = (
  username: string
): [password, auto_hash] | null => {
  const result: any[] = db.query(
    "SELECT password FROM users WHERE username = ?",
    [username]
  );

  if (result.length > 0 && result[0].length > 0) {
    return result[0];
  }

  return null; // 若没有找到用户，返回 null
};

type userId = number;
export const findUserByAutoHash = (authHash: string): userId | null => {
  const result: any[] = db.query("SELECT id FROM users WHERE auto_hash = ?", [
    authHash,
  ]);

  if (result.length > 0 && result[0].length > 0) {
    return result[0][0];
  }

  return null; // 若没有找到用户，返回 null
};

export const deleteUserByUsername = (username: string) => {
  db.query("DELETE FROM users WHERE username = ?", [username]);
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
