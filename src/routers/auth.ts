import { Router, Status, route } from "../../deps.ts";
import {
  comparePassword,
  getUserAutoHash,
  passwordJwt,
} from "../helper/bcrypt.ts";
import { createUser, findUserByUsername } from "../models/user.ts";
import { generateUserToken } from "../service/auth.ts";

const router = new Router();

router.post(
  "/register",
  route(async (req) => {
    const { username, password } = await req.json();
    // 创建密码
    const hashedPassword = await passwordJwt(password);
    // 创建自动化hash
    const auto_hash = await getUserAutoHash(username);
    createUser(username, hashedPassword, auto_hash);
    return Response.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  })
);
router.post(
  "/login",
  route(async (request) => {
    const { username, password } = await request.json();
    const data = findUserByUsername(username);
    if (!data) {
      return Response.json({ message: "User not found" }, { status: Status.NotFound });
    }
    const [userPassword, auto_hash] = data;
    const validPassword = await comparePassword(password, userPassword);

    if (!validPassword) {
      return Response.json({ message: "Invalid password" }, { status: Status.Unauthorized });
    }
    // 生成token
    const token = generateUserToken(username);
    return Response.json(
      { auto_hash: auto_hash, token: token },
      { status: 200 }
    );
  })
);

export default router;
