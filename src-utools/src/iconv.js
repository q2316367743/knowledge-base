const iconv = require('iconv-lite');


/**
 * 解析buffer内容
 * @param buffer {Buffer} buffer
 * @param charset {string} 编码
 * @return {string} 字符串
 */
function parseBuffer(buffer, charset) {
    return iconv.decode(buffer, charset);
}

/**
 * 解析ArrayBuffer内容
 * @param buffer {ArrayBuffer} buffer
 * @param charset {string} 编码
 * @return {string} 字符串
 */
function parseArrayBuffer(buffer, charset) {
    return iconv.decode(Buffer.from(buffer), charset);
}


/**
 * 编码转换
 * @param content {string} 内容
 * @param source {string} 原始编码
 * @param target {string} 目标编码
 * @return {string} 内容
 */
function convertCharset(content, source, target = 'utf-8') {
    if (source.toUpperCase() === target.toUpperCase()) {
        // 编码一致
        return content;
    }
    const buffer = iconv.encode(content, source);
    return parseBuffer(buffer, target);
}


module.exports = {
    parseBuffer, parseArrayBuffer, convertCharset
}
