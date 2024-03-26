const fs = require('fs');
const path = require('path');

/**
 * Blob转Buffer
 * @param blob {Blob} 内容
 * @return {Promise<Buffer>}
 */
const blobToBuffer = async (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            resolve(buffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
};

window.preload = {
    /**
     * 写入文件
     * @param dir {string} 文件夹路径
     * @param name {string} 文件名
     * @param content {Blob} 文件内容
     * @return {Promise<string>} 文件路径
     */
    writeToFile(dir, name, content) {
        // 判断文件夹是否存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {recursive: true});
        }
        // blob转buffer
        return blobToBuffer(content).then(buffer => {
            const filePath = path.join(dir, name);
            fs.writeFileSync(filePath, buffer);
            return filePath;
        });
    }
};
