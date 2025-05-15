const {existsSync, createWriteStream, writeFileSync, unlink, mkdirSync, writeFile} = require('node:fs');
const {join} = require('node:path');
const http = require('node:http');
const https = require('node:https');
const {ipcRenderer} = require('electron');
const {createServer} = require('./src/server');
const {openFile} = require('./src/file');
const {parseBuffer, parseArrayBuffer, convertCharset} = require('./src/iconv');
const {encryptPassword, verifyPassword, encryptValue, decryptValue} = require('./src/encrypt');
const {uploadToImagePlus, runCommand, axios} = require('./src/terminal');
const {blobToBuffer, showSaveDialog, shellOpenPath} = require('./src/common');

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

window.preload = {
  customer: {
    /**
     * 写入文件
     * @param dir {string} 文件夹路径
     * @param name {string} 文件名
     * @param content {Blob} 文件内容
     * @param root {string}  根目录
     *
     * @return {Promise<string>} 文件路径
     */
    writeToFile(dir, name, content, root) {
      let folder;
      if (root) {
        folder = join(root, dir);
      } else {
        folder = dir;
      }
      // 判断文件夹是否存在
      if (!existsSync(folder)) {
        mkdirSync(folder, {recursive: true});
      }
      // blob转buffer
      return blobToBuffer(content).then(buffer => {
        const filePath = join(folder, name);
        writeFileSync(filePath, buffer);
        return filePath;
      });
    },
    /**
     * 写入字符串文件
     * @param dir {string} 文件夹路径
     * @param name {string} 文件名
     * @param content {string} 文件内容
     * @param root {string}  根目录
     *
     * @return {Promise<string>} 文件路径
     */
    async writeStrToFile(dir, name, content, root) {
      let folder;
      if (root) {
        folder = join(root, dir);
      } else {
        folder = dir;
      }
      // 判断文件夹是否存在
      if (!existsSync(folder)) {
        mkdirSync(folder, {recursive: true});
      }
      const filePath = join(folder, name);
      return new Promise((resolve, reject) => {
        writeFile(filePath, content, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({filePath, folder});
          }
        });
      })
    },
    /**
     * 写入blob到文件
     * @param content {Blob} 文件内容
     * @param title {title} 文件标题
     * @returns {Promise<string>} 文件路径
     */
    async writeBlobToFile(content, title) {
      const p = showSaveDialog({
        title,
        buttonLabel: '保存',
        properties: ['createDirectory']
      });
      if (p) {
        const bf = await blobToBuffer(content);
        return new Promise((resolve, reject) => {
          writeFile(p, bf, (err) => {
            if (err) {
              reject(err);
            } else {
              shellOpenPath(p);
              resolve(p);
            }
          });
        })
      }
    },
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
        (/https/.test(url) ? https : http).get(url, function (response) {
          response.pipe(file);
          file.on('finish', function () {
            file.close(e => {
              if (e) {
                reject(e);
                return;
              }
              resolve(filePath)
            });
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
  ipcRenderer: {
    receiveMessage,
    sendMessage(id, channel, message) {
      ipcRenderer.sendTo(id, channel, message);
    }
  },
  util: {uploadToImagePlus, runCommand, axios},
  iconv: {parseBuffer, parseArrayBuffer, convertCharset},
  encrypt: {encryptPassword, verifyPassword, encryptValue, decryptValue}
};


