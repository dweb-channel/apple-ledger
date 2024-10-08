import { db } from "../../database/db.ts";

import { desc, eq } from "npm:drizzle-orm/expressions";
import { sql } from "npm:drizzle-orm/sql/sql";
import { integer, sqliteTable, text } from "npm:drizzle-orm/sqlite-core";
import { users } from "./user.ts";

// 账本表
export const ledgers = sqliteTable("ledgers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id), // user 表的外键
  events: text("events", { mode: "json" }).notNull(),
  previousHash: text("previousHash").notNull(),
  hash: text("hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

/**添加记账事件 */
export const add = async (
  userId: number,
  eventJson: string,
  previousHash: string,
  hash: string,
) => {
  await db.insert(ledgers).values({
    userId: userId,
    events: eventJson,
    previousHash: previousHash,
    hash: hash,
  });
};

/** 获取用户记账事件（支持分页和按时间倒序） */
export const getUserEvent = async (
  userId: number,
  page: number = 1,
  pageSize: number = 10,
) => {
  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({ events: ledgers.events })
    .from(ledgers)
    .where(eq(ledgers.userId, userId))
    .orderBy(desc(ledgers.createdAt)) // 按 createdAt 倒序排序
    .limit(pageSize) // 限制返回的记录数
    .offset(offset); // 跳过的记录数

  const result: $LedgerEvent[] = rows.map((row) => {
    try {
      return JSON.parse(row.events as string);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  });

  // 过滤掉可能的 null 值
  const validResults = result.filter((event) => event !== null);
  return validResults;
};

/** 获取最后插入的一个 block */
export const getLastBlock = async (userId: number) => {
  const [block] = await db
    .select()
    .from(ledgers)
    .where(eq(ledgers.userId, userId))
    .orderBy(desc(ledgers.createdAt))
    .limit(1);
  
  return block || null; // 如果没有查询到 block，返回 null
};

export const updateEventData = async (
  id: number,
  eventData: $LedgerEvent,
  updateIndex: number,
) => {
  // 查找指定 user_id 的记录
  const row = await db
    .select({ events: ledgers.events })
    .from(ledgers)
    .where(eq(ledgers.id, id))
    .limit(1);

  const getEvent = row[0].events as string;
  // 如果存在记录，解析 JSON 并更新数据
  let events: $LedgerEvent[] = JSON.parse(getEvent) as $LedgerEvent[];
  // 假设我们只更新第一个事件
  if (events.length > 0) {
    events[updateIndex] = eventData;
  }

  // 更新数据库
  const updateResult = await db
    .update(ledgers)
    .set({ events: JSON.stringify(events) })
    .where(eq(ledgers.id, id));
  if (updateResult.columns.length === 0) {
    return false;
  } else {
    return true;
  }
};

// [{ amount: "-10", class: "奶茶", event: "哈哈" }] , updated_at = CURRENT_TIMESTAMP
export type $LedgerEvent = { amount: string; class: string; event: string };
