/**
 * 判断密码是否正确
 * @param text 输入的文本
 * @param password 密钥
 */
export function passwordEqual(text: string, password: string) {
  return text === password;
}

/**
 * 生成密码密钥
 * @param password 密码
 * @return 密钥
 */
export function buildPassword(password: string) {
  return password;
}

/**
 * 加密
 * @param text 文本
 * @param password 密码
 */
export function encryptText(text: string, password: string) {
  return text;
}

/**
 * 解密
 * @param text 文本
 * @param password 密码
 */
export function decryptText(text: string, password: string) {
  return text;
}