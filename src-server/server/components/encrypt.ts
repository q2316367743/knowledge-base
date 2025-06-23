import { createCipheriv, createDecipheriv, createHash } from "node:crypto";

interface KeyIv {
  key: string;
  iv: string;
}

/**
 * 获取密钥和偏移量
 * @param passphrase
 * @return {{key: string, iv: string}}
 */
function getKeyIv(passphrase: string): KeyIv {
  const hash1 = createHash("md5").update(passphrase).digest("hex");
  const hash2 = createHash("md5")
    .update(hash1 + passphrase)
    .digest("hex");
  const hash3 = createHash("md5")
    .update(hash2 + passphrase)
    .digest("hex");
  return { key: hash2, iv: hash3.substring(0, 16) };
}

/**
 * 加密密码
 * @param pwd  密码
 * @return 加密后的hash
 */
export const encryptPassword = async (pwd: string): Promise<string> => {
  if (!pwd) return "";
  return Bun.password.hash(pwd, { algorithm: "bcrypt" });
};
/**
 * 验证密码是否正确
 * @param pwd 密码
 * @param hash 加密后的hash
 */
export const verifyPassword = async (
  pwd: string,
  hash: string
): Promise<KeyIv | boolean> => {
  if (await Bun.password.verify(pwd, hash, "bcrypt")) {
    return getKeyIv(pwd);
  }
  return false;
};
/**
 * 加密字符串
 * @param keyIv
 * @param data  数据
 * @return 加密后的值
 */
export const encryptValue = (keyIv: KeyIv, data: string): string => {
  if (!data) return "";
  const cipher = createCipheriv("aes-256-cbc", keyIv.key, keyIv.iv);
  return cipher.update(data, "utf8", "hex") + cipher.final("hex");
};
/**
 * 解密值
 * @param keyIv
 * @param data 数据
 */
export const decryptValue = (keyIv: KeyIv, data: string): string => {
  if (!data) return "";
  const decipher = createDecipheriv("aes-256-cbc", keyIv.key, keyIv.iv);
  return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
};
