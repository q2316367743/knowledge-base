const http = require('node:http');
const url = require('node:url');
const path = require('node:path');
const {Buffer} = require("buffer");

function handleFileUpload(req, res) {
  const boundary = req.headers['content-type'].split('; ')[1].replace('boundary=', '');
  let body = [];
  let fileData = null;
  let fileName = '';
  let fileExt = '';

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    body = Buffer.concat(body);

    // 解析multipart/form-data
    const parts = body.toString().split(`--${boundary}`);

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="file"')) {
        const match = part.match(/filename="(.+?)"/);
        if (match) {
          fileName = match[1];
          fileExt = path.extname(fileName);
        }

        const contentStart = part.indexOf('\r\n\r\n') + 4;
        const contentEnd = part.lastIndexOf('\r\n');
        fileData = part.slice(contentStart, contentEnd);
      }
    }

    if (fileData && fileName) {
      // 保存文件到服务器
      utools.db.postAttachment(`/article/attachment/${Date.now()}.${fileExt}`, fileData, 'image');
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No file uploaded' }));
    }
  });
}

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
    } else if (req.method === 'POST' && req.url.startsWith('/attachment')) {
      handleFileUpload(req, res);
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
