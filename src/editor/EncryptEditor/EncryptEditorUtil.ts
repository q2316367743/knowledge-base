import {isEmptyString} from "@/utils/lang/FieldUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

/**
 * 判断密码是否正确
 * @param text 输入的文本
 * @param password 密钥
 */
export function passwordEqual(text: string, password: string) {
  return InjectionUtil.native.encrypt.verifyPassword(text, password);
}

/**
 * 生成密码密钥
 * @param password 密码
 * @return 密钥
 */
export function buildPassword(password: string) {
  return InjectionUtil.native.encrypt.encryptPassword(password);
}

/**
 * 加密
 * @param text 文本
 * @param keyIv 密码
 */
export function encryptText(text: string, keyIv: EncryptKeyIv) {
  return InjectionUtil.native.encrypt.encryptValue(keyIv, text);
}

/**
 * 解密
 * @param text 文本
 * @param keyIv 密码
 */
export function decryptText(text: string, keyIv: EncryptKeyIv) {
  if (isEmptyString(keyIv.key) && isEmptyString(keyIv.iv)) {
    return text;
  }
  return InjectionUtil.native.encrypt.decryptValue(keyIv, text);
}