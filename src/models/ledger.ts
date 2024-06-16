import db from "../../database/db.ts";

export const add = (
  userId: number,
  eventJson: string,
  timestamp: string,
  previousHash: string,
  hash: string
) => {
  db.query(
    "INSERT INTO ledgers (user_id, events,timestamp,previousHash,hash) VALUES (?, ?, ?, ?, ?)",
    [userId, eventJson, timestamp, previousHash, hash]
  );
};

export const getUserEvent = (userId: number) => {
  const result: $LedgerEvent[] = [];
  const rows = db.query("SELECT events FROM ledgers WHERE user_id = ?", [
    userId,
  ]);
  rows.forEach((row) => {
    const eventStr = row[0] as string;
    const eventJson = JSON.parse(eventStr);
    result.push(eventJson);
  });
  return result;
};

const updateEventData = (
  id: number,
  eventData: $LedgerEvent,
  updateIndex: number
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // 查找指定 user_id 的记录
    const row = db.query("SELECT events FROM ledgers WHERE id = ?", [
      id,
    ]);

    const getEvent = row[0][0] as string;
    // 如果存在记录，解析 JSON 并更新数据
    let events: $LedgerEvent[] = JSON.parse(getEvent) as $LedgerEvent[];
    // 假设我们只更新第一个事件
    if (events.length > 0) {
      events[updateIndex] = eventData;
    }

    // 更新数据库
    const updateErr = db.query(
      `UPDATE ledgers SET event = ? WHERE id = ?`,
      [JSON.stringify(events), id]
    );
    if (updateErr) {
      reject(updateErr);
    } else {
      resolve(true); // 更新成功返回 true
    }
  });
};

// [{ amount: "-10", class: "奶茶", event: "哈哈" }] , updated_at = CURRENT_TIMESTAMP
export type $LedgerEvent = { amount: string; class: string; event: string };
