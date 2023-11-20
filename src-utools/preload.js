const fs = require('fs');
const {
    join,
    dirname,
    extname,
    basename,
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

/**
 * 读取
 * @param {string} path 文件夹目录
 * @return {Promise<Array<string>>} 所有的文件
 */
function readFolderAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (e, files) => {
            if (e) {
                reject(e);
                return;
            }
            resolve(files);
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
    async readDir(dir) {
        const items = [];
        const files = await readFolderAsync(dir);
        for (let file of files) {
            const fullPath = join(dir, file);
            const stat = fs.statSync(fullPath);
            items.push({
                path: fullPath,
                name: file,
                ext: extname(file),
                dir: stat.isDirectory()
            })
        }
        return Promise.resolve(items);
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
     * 拷贝一个文件到目标目录
     * @param {string} source 文件目录
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
     * 拷贝一个文件夹到目标目录
     * @param {string} source 文件夹目录
     * @param {string} target  目标目录
     * @return {Promise<void>} 完成
     */
    async copyFolder(source, target) {
        // 创建目标文件夹
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }
        // 遍历源文件夹中的每个文件或子文件夹
        const files = await readFolderAsync(source);
        for (let file of files) {
            // 构造源文件/文件夹的完整路径
            const sourcePath = join(source, file);

            // 构造目标文件/文件夹的完整路径
            const targetPath = join(target, file);
            // 获取文件/文件夹的详细信息
            const stat = fs.statSync(sourcePath);

            if (stat.isFile()) {
                // 如果是文件，则直接复制文件
                fs.copyFileSync(sourcePath, targetPath);
            } else if (stat.isDirectory()) {
                // 如果是文件夹，则递归复制文件夹
                await this.copyFolder(sourcePath, targetPath);
            }
        }

        return Promise.resolve();
    },

    /**
     * 移动一个文件、文件夹到目标目录
     * @param {string} source 文件、文件夹目录
     * @param {string} destination  目标目录
     * @return {Promise<void>} 完成
     */
    move(source, destination) {
        const file = basename(source);
        const target = join(destination, file)
        return new Promise((resolve, reject) => {
            fs.rename(source, target, e => {
                if (e) {
                    reject(e)
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
    rename(oldPath, newPath) {
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
    basename: basename,
    dirname: dirname,
    join: join
}
