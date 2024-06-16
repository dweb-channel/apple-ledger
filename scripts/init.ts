import db from "../database/db.ts";

/// 初始化数据

/**
 * 创建用户表
 * auto_hash 自动化ID
 * */
db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    auto_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
  )
`);

/**
 * 创建账本表，并关联 user_id 与 users 表的 id
 * event :{ amount: "-10", class: "奶茶", event: "哈哈" }
 */
db.execute(`
  CREATE TABLE IF NOT EXISTS ledgers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    events TEXT CHECK(json_valid(events)),
    timestamp DATETIME,
    previousHash TEXT,
    hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// -- 用户表的触发器
db.execute(`
  CREATE TRIGGER update_users_updated_at
  AFTER UPDATE ON users
  FOR EACH ROW
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
  END;
`);

// -- 账本表的触发器
db.execute(`
CREATE TRIGGER update_ledgers_updated_at
AFTER UPDATE ON ledgers
FOR EACH ROW
BEGIN
  UPDATE ledgers SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
`);

// generate_key.ts
const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

// 导出密钥为 JWK 格式
const exportedKey = await crypto.subtle.exportKey("jwk", key);

// 将密钥存储到文件中
await Deno.writeTextFile("jwt_hmac_key.json", JSON.stringify(exportedKey));

console.log("Key generated and stored in jwt_hmac_key.json");
