import { Router, Status, route } from "../../deps.ts";
import { $LedgerEvent } from "../models/ledger.ts";
import { findUserByAutoHash } from "./../models/user.ts";

const router = new Router();
/**apple快捷指令添加一条数据 */
router.post(
  "/add/:auto_hash",
  route(async (request, context) => {
    const auto_hash = context.params.auto_hash;
    // 尝试获取userId
    const userId = findUserByAutoHash(auto_hash);
    if (!userId) {
      return Response.json(
        { message: "error auto hash" },
        { status: Status.Forbidden }
      );
    }
    const event: $LedgerEvent = await request.json();
    console.log(`用户${userId} 添加了记录：`, event);
    // 插入账本事件，并设定记账时间
    const timestamp = new Date().toISOString(); // 当前时间
    // TODO
    return Response.json({ message: "ok" }, { status: Status.OK });
  })
);

export default router;

// const newTimestamp = new Date('2024-06-16T12:00:00').toISOString(); // 用户设定的新时间