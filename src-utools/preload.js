const fs = require('fs');
const {
    join,
    dirname,
    extname,
    basename
} = require('path');

/**
 * 写入文件
 * @param {string} path 目录
 * @param {string | Uint8Array} contents 内容
 * @return {Promise<void>} 结果
 */
function writeFile(path, contents) {
    const folder = dirname(path);
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {
            recursive: true
        })
    }
    return new Promise((resolve, reject) => {
        fs.writeFile(path, contents, {
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


window.fs = {
    /**
     * 读取文本文件
     * @prarm {string} filePath 文件路径
     * @return {Promise<string>} 文件文本内容
     */
    readTextFile(filePath) {
        const folder = dirname(filePath);
        if (!fs.existsSync(folder)) {
            return Promise.resolve('');
        }
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString("utf-8"));
                }
            });
        });
    },

    /**
     * 读取二进制文件
     * @param {string} filePath 文件路径
     * @return {Promise<Uint8Array>} 二进制内容
     */
    readBinaryFile(filePath) {
        const folder = dirname(filePath);
        if (!fs.existsSync(folder)) {
            return Promise.resolve('');
        }
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString("binary"));
                }
            });
        });
    },

    /**
     * 写入文本文件
     * @param {string} path 文件路径
     * @param {string} contents 文件内容
     * @return {Promise<void>} 完成
     */
    writeTextFile(path, contents) {
        return writeFile(path, contents);
    },

    /**
     * 写入二进制文件
     * @param {string} path 文件路径
     * @param {Uint8Array} contents 文件内容
     * @return {Promise<void>} 完成
     */
    writeBinaryFile(path, contents) {
        return writeFile(path, contents);
    },

    /**
     * 读取一个目录
     * @param {string} dir 目录路径
     * @return {Promise<{path: string, name: string, ext: string, dir:boolean}>} 全部的文件
     */
    readDir(dir) {
        return new Promise(resolve => {
            const items = [];
            fs.readdirSync(dir).forEach(file => {
                const fullPath = join(dir, file);
                const stat = fs.statSync(fullPath);
                items.push({
                    path: fullPath,
                    name: file,
                    ext: extname(file),
                    dir: stat.isDirectory()
                })
            });
            resolve(items);
        });
    },

    /**
     * 创建目录
     * @param {string} dir 目录路径
     * @return {Promise<void>} 完成
     */
    createDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            })
        }
        return Promise.resolve();
    },

    /**
     * 删除目录
     * @param {string} dir 目录路径
     * @param {boolean} recursive 是否递归删除
     * @return {Promise<void>} 完成
     */
    removeDir(dir, recursive) {
        if (!fs.existsSync(dir)) {
            return Promise.reject("目标不存在");
        }
        if (!fs.statSync(dir).isDirectory()) {
            return Promise.reject("目标不是文件夹");
        }
        return new Promise((resolve, reject) => {
            fs.rmdir(dir, {
                recursive: recursive
            }, e => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            })
        })
    },

    /**
     * 拷贝一个文件、文件夹到目标目录
     * @param {string} source 文件、文件夹目录
     * @param {string} destination  目标目录
     * @return {Promise<void>} 完成
     */
    copyFile(source, destination) {
        if (!fs.existsSync(destination)) {
            return Promise.reject("目标不存在");
        }
        if (!fs.statSync(destination).isDirectory()) {
            return Promise.reject("目标不是文件夹");
        }
        return new Promise((resolve, reject) => {
            fs.copyFile(source, destination, e => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            })
        })
    },

    /**
     * 删除文件
     * @param {string} file 文件、文件夹目录
     * @return {Promise<void>} 完成
     */
    removeFile(file) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(file)) {
                fs.unlink(file, e => {
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
    },

    /**
     * 重命名文件
     * @param {string} oldPath 旧的路径
     * @param {string} newPath 新的路径
     * @return {Promise<void>} 完成
     */
    renameFile(oldPath, newPath) {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, e => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve();
            });
        });
    },

    /**
     * 判断一个文件是否存在
     * @param {string} path 旧的路径
     * @return {Promise<boolean>} 是否存在
     */
    exists(path) {
        return new Promise(resolve => {
            fs.exists(path, e => {
                resolve(e);
            });
        });
    }
}

window.path = {
    extname: extname,
    basename: basename
}
