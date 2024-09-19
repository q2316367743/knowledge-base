const {existsSync, createWriteStream, writeFileSync, unlink, mkdirSync, readFile} = require('node:fs');
const {join, basename} = require('node:path');
const {get} = require('node:https');
const {ipcRenderer} = require('electron');
const {createServer} = require('./src/server');


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

/**
 * 接收消息发过来的消息
 * @param event {string} 事件
 * @param callback {(msg: string) => void} 接收消息回调
 */
function receiveMessage(event, callback) {
    ipcRenderer.on(event, (_event, res) => {
        if (callback) {
            callback(res);
        }
    })
}

/**
 * 获取一个文件
 * @param options {options: {
 *     title?: string,
 *     defaultPath?: string,
 *     buttonLabel?: string,
 *     filters?: { name: string, extensions: string[] }[],
 *     properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>,
 *     message?: string,
 *     securityScopedBookmarks?: boolean
 *   }} 参数
 * @return {Promise<File>} 返回blob对象
 */
function openFile(options) {
    return new Promise((resolve, reject) => {
        const paths = utools.showOpenDialog(options);
        const path = paths[0];
        if (path) {
            readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                const blob = new Blob([data], {type: 'application/octet-stream'});
                resolve(new File([blob], basename(path)));
            })
        }
    })
}

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
        if (!existsSync(dir)) {
            mkdirSync(dir, {recursive: true});
        }
        // blob转buffer
        return blobToBuffer(content).then(buffer => {
            const filePath = join(dir, name);
            writeFileSync(filePath, buffer);
            return filePath;
        });
    },
    customer: {
        // 检查文件是否存在
        checkFileExist(root, dir, file) {
            const filePath = join(root, dir, file);
            return existsSync(filePath);
        },
        downloadFile(root, dir, fileName, url) {
            return new Promise((resolve, reject) => {
                const folder = join(root, dir);
                if (!existsSync(folder)) {
                    mkdirSync(folder, {recursive: true});
                }
                const filePath = join(folder, fileName);
                const file = createWriteStream(filePath);
                get(url, function (response) {
                    response.pipe(file);
                    file.on('finish', function () {
                        file.close(resolve);
                    });
                }).on('error', function (err) {
                    unlink(filePath, () => {
                    });
                    reject(err)
                });
            })
        },
        createServer, openFile
    },
    path: {
        join: join
    },
    ipcRenderer: {
        receiveMessage
    }
};


