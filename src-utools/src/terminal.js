const {ServiceClient} = require("@xiaou66/interconnect-client");
const path = require("node:path");
const {spawn} = require("node:child_process");
const axios = require("axios");
const https = require("node:https");
const {getPath} = require('./common');


const pipPath = path.join(getPath('userData'), '.pip');

let client = null;

module.exports = {
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
    const {signal} = controller;

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
  },

  axios: axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    adapter: 'http',
    timeout: '30000'
  }),
}