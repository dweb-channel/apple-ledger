import { Payload, assertFalse, create, verify } from "../../deps.ts";

// 读取存储的密钥文件
const keyData = await Deno.readTextFile("jwt_hmac_key.json");
const importedKey = JSON.parse(keyData);

// 导入密钥
const key = await crypto.subtle.importKey(
  "jwk",
  importedKey,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

/**创建jwt */
export const createJwt = async (pyload: Payload) => {
  const jwt = await create({ alg: "HS512", typ: "JWT" }, pyload, key);
  return jwt;
};

/**获取自动化id */
export const getUserAutoHash = async (username: string) => {
  const toHash = Date.now() + username;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(toHash)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**加密密码 */
export const passwordJwt = (password: string) => {
  return createJwt({ password: password });
};

/**对比密码 */
export const comparePassword = async (password: string, jwt: string) => {
  const payload = await verify(jwt, key);
  return payload["password"] === password;
};

export const verifyJwt = (jwt: string) => {
  return verify(jwt, key);
};

export const bufferToHex = (hashBuffer:ArrayBuffer) => Array.from(new Uint8Array(hashBuffer))
.map((b) => b.toString(16).padStart(2, "0"))
.join("")


Deno.test("HMAC-SHA-512", async () => {
  const pyload = "🍓";
  const jwt = await passwordJwt(pyload);
  console.log("jwt key", jwt);
  const result = await comparePassword(pyload, jwt);
  console.log("result=>", result);
  assertFalse(!result);
});

Deno.test("getUserAutoHash", async () => {
  console.log(await getUserAutoHash("admin"));
});
