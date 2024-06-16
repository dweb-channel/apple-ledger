import { Context } from "../../deps.ts";
import { verifyJwt } from "../helper/bcrypt.ts";

export async function jwtMiddleware(ctx: Context, next: () => Promise<void>) {
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
    ctx.state.user = payload;
    await next();
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid or expired token" };
  }
}
