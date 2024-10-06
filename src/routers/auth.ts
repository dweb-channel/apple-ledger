import { route, Router, Status } from "../../deps.ts";
import { createGenesisBlock } from "../blockchain/block.ts";
import {
  comparePassword,
  getUserAutoHash,
  passwordJwt,
} from "../helper/bcrypt.ts";
import { createUser, findUserByUsername } from "../models/user.ts";
import { generateUserToken } from "../service/auth.ts";

const router = new Router();

router.put(
  "/user/register",
  route(async (req) => {
    const { username, password } = await req.json();
    const data = await findUserByUsername(username);
    if (data !== null) {
      return Response.json(
        { message: "Name is occupied" },
        { status: 400 },
      );
    }
    // 创建密码
    const hashedPassword = await passwordJwt(password);
    // 创建自动化hash
    const autoHash = await getUserAutoHash(username);
    // 创建用户
    const userId = await createUser(username, hashedPassword, autoHash);
    // 创建用户创世区块，每个用户拥有一条链
    const block =  createGenesisBlock(userId);
    return Response.json(
      {
        message: "User registered successfully",
        data: { username: username, auto_hash: autoHash,genesis_block:block.hash },
      },
      { status: 201 },
    );
  }),
);
router.post(
  "/user/login",
  route(async (request) => {
    const { username, password } = await request.json();
    const data = await findUserByUsername(username);
    if (!data) {
      return Response.json({ message: "User not found" }, {
        status: Status.NotFound,
      });
    }
    const userPassword = data.password;
    const auto_hash = data.auto_hash;
    const validPassword = await comparePassword(password, userPassword);
    // console.log("userPassword, auto_hash",userPassword, auto_hash)

    if (!validPassword) {
      return Response.json({ message: "Invalid password" }, {
        status: Status.Unauthorized,
      });
    }
    // 生成token
    const token = await generateUserToken(data.id,username);
    return Response.json(
      { auto_hash: auto_hash, token: token },
      { status: 200 },
    );
  }),
);

export default router;
