import { Status } from "jsr:@oak/commons@0.11/status";
import { Router } from "jsr:@oak/oak/router";

const baseRouter = new Router();
baseRouter.post("/add/:id", async (context) => {
  const userId = context.params.id
  const event:$LedgerEvent = await context.request.body.json()
  console.log(`用户${userId} 添加了记录：`, event);
  context.response.status = Status.OK
});

export { baseRouter };

// { amount: "-10", class: "奶茶", event: "哈哈" }
export type $LedgerEvent = { amount: string; class: string; event: string };
