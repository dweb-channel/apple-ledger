import { createJwt } from "../helper/bcrypt.ts";

/**
 * 生成用户token
 */
export const generateUserToken = (id: number, username: string) => {
  // 创建JWT
  const payload = {
    id: id,
    username: username,
    // exp: getNumericDate(60 * 60), // JWT 1小时内有效
  };
  return createJwt(payload);
};
