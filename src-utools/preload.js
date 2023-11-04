const fs = require('fs');
const { join, dirname, sep } = require('path');

/**
 * 读取一个文件
 * @param {string} root 根目录
 * @param {string} path 文件路径
 * @return {Promise<string>} 文件内容
 */
function readFileByText(root, path) {
    const render = join(root, path.replaceAll('/', sep));
    if (!fs.existsSync(render)) {
        return Promise.resolve('');
    }
    return new Promise((resolve, reject) => {
        fs.readFile(render, 'utf-8', (err, data) => {
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
 * @param {string | Uint8Array} data 文件内容
 * @returns {Promise<void>}
 */
function saveFile(root, path, data) {
    const render = join(root, path.replaceAll('/', sep));
    if (!fs.existsSync(render)) {
        fs.mkdirSync(join(root, dirname(path.replaceAll('/', sep))), {
            recursive: true
        })
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(render, data, {
            encoding: 'utf-8',
            flag: 'w'
        }, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })

}

/**
 * 删除文件
 * @param {string} root 根目录
 * @param {string} path 文件路径
 * @returns {Promise<void>}
 */
function removeFile(root, path) {
    const render = join(root, path.replaceAll('/', sep));
    return new Promise((resolve, reject) => {
        if (existsSync(render)) {
            fs.unlink(render, e => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            });
            return;
        }
        resolve();
    })
}

/**
 * 路径拼接
 * @param {string} root 根目录
 * @param {string} path 文件路径
 * @returns 新路径
 */
function pathJoin(root, path) {
    return join(root, path.replaceAll('/', sep));
}



/**
 * 列表目录下全部的文件
 * @param {string} root 根目录
 * @param {string} path 目录
 * @returns {Promise<string>} 全部的文件
 */
function listFile(root, path = '') {
    const render = join(root, path.replaceAll('/', sep));
    const items = [];
    getFiles(render, (file) => items.push(file));
    return Promise.resolve(items);
}


function getFiles(dirPath, callback) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, callback);
        } else {
            callback(fullPath);
        }
    });
}

window.preload = {
    readFileByText, saveFile, removeFile, pathJoin, listFile
}
