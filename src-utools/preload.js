const { readFile, existsSync, writeFile, mkdirSync } = require('fs');
const { join, dirname } = require('path');

/**
 * 读取一个文件
 * @param {string} root 根目录
 * @param {string} path 文件路径
 * @return {Promise<string>} 文件内容
 */
function readFileWrap(root, path) {
    const render = join(root, path);
    if (!existsSync(render)) {
        return Promise.resolve('');
    }
    return new Promise((resolve, reject) => {
        readFile(render, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * 保存文件
 * @param {string} root 根目录
 * @param {string} path 文件路径
 * @param {string} data 文件内容
 * @returns {Promise<void>}
 */
function saveFile(root, path, data) {
    const render = join(root, path);
    if (!existsSync(render)) {
        mkdirSync(join(root, dirname(path)), {
            recursive: true
        })
    }
    return new Promise((resolve, reject) => {
        writeFile(render, data, 'utf-8', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();;
        })
    })

}

window.preload = {
    readFile: readFileWrap,
    saveTextFile: saveFile
}
