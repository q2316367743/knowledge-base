const {hashSync, compareSync, genSaltSync} = require('./bcrypt/bcrypt');
const {createHash, createCipheriv, createDecipheriv} = require("node:crypto")

/**
 * 获取密钥和偏移量
 * @param passphrase
 * @return {{key: string, iv: string}}
 */
function getKeyIv(passphrase) {
  const hash1 = createHash('md5').update(passphrase).digest('hex')
  const hash2 = createHash('md5').update(hash1 + passphrase).digest('hex')
  const hash3 = createHash('md5').update(hash2 + passphrase).digest('hex')
  return {key: hash2, iv: hash3.substring(0, 16)}
}

module.exports = {
  /**
   * 加密密码
   * @param password  {string} 密码
   * @return {string} 加密后的值
   */
  encryptPassword: (password) => {
    if (!password) return "";
    return hashSync(password, genSaltSync())
  },
  /**
   * 验证密码是否正确
   * @param password 密码
   * @param key key
   * @return {{key: string, iv: string}|boolean}
   */
  verifyPassword: (password, key) => {
    if (compareSync(password, key)) {
      return getKeyIv(password)
    }
    return false
  },
  /**
   * 加密字符串
   * @param keyIv {{key: string, iv: string}}
   * @param data {string} 数据
   * @return {string} 加密后的值
   */
  encryptValue: (keyIv, data) => {
    if (!data) return ''
    const cipher = createCipheriv('aes-256-cbc', keyIv.key, keyIv.iv)
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  },
  /**
   * 解密值
   * @param keyIv {{key: string, iv: string}}
   * @param data {string} 数据
   * @return {string}
   */
  decryptValue: (keyIv, data) => {
    if (!data) return ''
    const decipher = createDecipheriv('aes-256-cbc', keyIv.key, keyIv.iv)
    return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
  },
}