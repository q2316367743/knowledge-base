const {existsSync, createWriteStream, writeFileSync, unlink, mkdirSync, writeFile} = require('node:fs');
const {join} = require('node:path');
const http = require('node:http');
const https = require('node:https');
const {ipcRenderer} = require('electron');
const {createServer} = require('./src/server');
const {openFile} = require('./src/file');
const {ServiceClient} = require('@xiaou66/interconnect-client');
const path = require('path');
const {spawn} = require('node:child_process');


/**
 * Blob转Buffer
 * @param blob {Blob} 内容
 * @return {Promise<Buffer>}
 */
const blobToBuffer = async (blob) => {
  return  blob.arrayBuffer().then(buffer => Buffer.from(buffer));
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

const pipPath = path.join(utools.getPath('userData'), '.pip');

let client = null;

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
        const filePath = join(dir, name);
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
  path: {
    join: join
  },
  ipcRenderer: {
    receiveMessage,
    sendMessage(id, channel, message) {
      ipcRenderer.sendTo(id, channel, message);
    }
  },
  util: {
    async uploadToImagePlus(filePath, pluginName) {
      try {
        if (!client) {
          client = new ServiceClient(require('net'),
            path.join(pipPath, 'picture-bed-plus'),
            pluginName);
        }
        const res = await client
          .callServiceMethod('service.upload.file.async', {
            filePath: filePath
          });
        return res.url
      } catch (e) {
        // 链接失败, 可以做出提醒或者使用跳转「图床 Plus」插件上传
        return Promise.reject(e);
      }

    },
    /**
     * 运行命令
     * @param command {string} 命令
     * @param options {{onProgress: (e: string) => void, onSuccess: () => void, onError: (e: string) => void}} 参数
     */
    runCommand(command, options) {
      const {onProgress, onSuccess, onError} = options;

      const controller = new AbortController();
      const { signal } = controller;

      const child = spawn(command, {
        shell: true,
        signal
      });
      child.stdout.on('data', (data) => {
        onProgress(data.toString());
      });
      child.stderr.on('data', (data) => {
        onError(data.toString());
      });
      child.on('close', (code) => {
        if (!code) {
          onSuccess();
        } else {
          onError(`命令执行失败，错误码：${code}`);
        }
      });
      return {
        abort: () => controller.abort(),
      }
    }
  }
};


