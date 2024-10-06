import { Context } from "../../deps.ts";
import { verifyJwt } from "../helper/bcrypt.ts";

interface $User {
  id: number;
  username: string;
}

// 扩展 Context，使其包含 state.user
interface $AuthenticatedContext extends Context {
  state: {
    user: $User; // 声明 state.user 的类型
  };
}

export async function authMiddleware(
  ctx: $AuthenticatedContext,
  next: () => Promise<unknown>,
) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Authorization header is missing" };
    return;
  }

  const jwt = authHeader.split(" ")[1]; // 假设JWT在"Bearer <token>"格式中

  if (!jwt) {
    ctx.response.status = 401;
    ctx.response.body = { message: "JWT token is missing" };
    return;
  }
  try {
    const payload = await verifyJwt(jwt);
    ctx.state.user = payload as unknown as $User;
    await next();
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid or expired token" };
  }
}
