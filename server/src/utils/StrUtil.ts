/**
 * 生成随机字符串
 * @param len 字符串长度
 * @return 字符串
 */
export function getRandomChar(len: number): string {
    const x = "0123456789qwertyuioplkjhgfdsazxcvbnm"; // 需要什么字符这里添加
    let tmp = "";
    const timestamp = new Date().getTime();
    for (let i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}