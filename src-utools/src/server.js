const http = require('node:http');
const url = require('node:url');

const getAttachment = (() => {
  if ('utools' in window) {
    return utools.db.promises.getAttachment
  } else if ('focusany' in window) {
    return Promise.resolve(focusany.db.getAttachment)
  } else {
    return Promise.resolve(docId => null);
  }
})();
const getAttachmentType = (() => {
  if ('utools' in window) {
    return utools.db.getAttachmentType
  } else if ('focusany' in window) {
    return Promise.resolve(focusany.db.getAttachmentType)
  } else {
    return Promise.resolve(docId => null);
  }
})()

function createServer(port, successCallback, errorCallback) {

  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/attachment')) {
      const key = `${url.parse(req.url, true).query.key}`;
      if (!key) {
        res.writeHead(400);
        res.end('缺少图片链接参数');
        return;
      }

      getAttachment(key)
        .then((buffer) => {
          // 设置响应头
          const contentType = getAttachmentType(key);
          res.writeHead(200, {'Content-Type': contentType});

          // 将图片内容转发给客户端
          res.write(buffer);
          res.end();
        })
        .catch(e => {
          res.writeHead(500);
          res.end(`请求图片链接时出错: ${e.message}`);
        })

    } else {
      res.writeHead(404);
      res.end('未找到资源');
    }
  });


  server.listen(port, () => {
    successCallback();
    console.log(`服务器已启动，监听端口 http://localhost:${port}`);
  });

  server.on('error', errorCallback);

}

module.exports = {
  createServer
};
