const http = require('node:http');
const url = require('node:url');

function createServer(port, successCallback, errorCallback) {

  const server = http.createServer((req, res) => {
    // 设置CORS头，允许跨域请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理OPTIONS请求（预检请求）
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const parsedUrl = url.parse(req.url, true);

    // 处理附件请求
    if (req.method === 'GET' && req.url.startsWith('/attachment')) {
      const key = `${parsedUrl.query.key}`;
      if (!key) {
        res.writeHead(400);
        res.end('缺少图片链接参数');
        return;
      }

      utools.db.promises.getAttachment(key)
        .then((buffer) => {
          // 设置响应头
          const contentType = utools.db.getAttachmentType(key);
          res.writeHead(200, {'Content-Type': contentType});

          // 将图片内容转发给客户端
          res.write(buffer);
          res.end();
        })
        .catch(e => {
          res.writeHead(500);
          res.end(`请求图片链接时出错: ${e.message}`);
        });
      return;
    }

    // 未找到匹配的路由
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      code: 404,
      message: '未找到资源',
      data: null
    }));
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
