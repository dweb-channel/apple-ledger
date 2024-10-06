import { route, Router, Status } from "../../deps.ts";
import { Block } from "../blockchain/block.ts";
import { authMiddleware } from "../middlewares/safe.ts";
import { $LedgerEvent, getLastBlock } from "../models/ledger.ts";
import { getUserEvent } from "./../models/ledger.ts";
import { findUserByAutoHash } from "./../models/user.ts";

const router = new Router();
/**apple快捷指令添加一条数据 */
router.post(
  "/add/:auto_hash",
  route(async (request, context) => {
    const auto_hash = context.params.auto_hash;
    // 尝试获取userId
    const userId = await findUserByAutoHash(auto_hash);
    if (!userId) {
      return Response.json(
        { message: "error auto hash" },
        { status: Status.Forbidden },
      );
    }
    const event: $LedgerEvent = await request.json();
    const lastBlock = await getLastBlock(userId);
    console.log(`用户${userId} 添加了记录：`, event);
    // 插入账本事件
    const block = new Block(lastBlock.hash,Date.now(),[event]);
    return Response.json({ message: "ok" }, { status: Status.OK });
  }),
);

router.get(
  "/get/events",
  authMiddleware,
  route(async (_, context) => {
    // 第几页
    const page = Number(context.params.page) || 1;
    // 每页多少
    const pageSize = Number(context.params.page_size) || 10;
    const user = context.state.user; // 从中间件获取用户信息
    const events = await getUserEvent(user.id, page, pageSize);
    return Response.json(events, { status: Status.OK });
  }),
);

export default router;

// const newTimestamp = new Date('2024-06-16T12:00:00').toISOString(); // 用户设定的新时间
