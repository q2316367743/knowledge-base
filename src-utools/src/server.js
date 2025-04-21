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
})();

// 获取文章列表和文章详情的数据库操作
const getArticleList = async () => {
  if ('utools' in window) {
    const result = await utools.db.promises.get('kb-article');
    return result ? result.value.filter(article => !article.isDelete) : [];
  } else if ('focusany' in window) {
    const result = await focusany.db.get('kb-article');
    return result ? result.value.filter(article => !article.isDelete) : [];
  } else {
    return [];
  }
};

const getArticleById = async (id) => {
  if (!id) return null;
  
  try {
    // 获取文章索引
    const articleList = await getArticleList();
    const articleIndex = articleList.find(article => article.id === Number(id));
    if (!articleIndex) return null;
    
    // 获取文章内容
    let content = null;
    let base = null;
    
    if ('utools' in window) {
      content = await utools.db.promises.get(`kb-article-content${id}`);
      base = await utools.db.promises.get(`kb-article-base${id}`);
    } else if ('focusany' in window) {
      content = await focusany.db.get(`kb-article-content${id}`);
      base = await focusany.db.get(`kb-article-base${id}`);
    }
    
    return {
      index: articleIndex,
      content: content ? content.record : { content: '' },
      base: base ? base.record : { tags: [], description: '', source: '', sourceUrl: '' }
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
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
        });
      return;
    }
    
    // 处理MCP API请求
    // 获取所有文章列表
    if (req.method === 'GET' && req.url.startsWith('/mcp/articles')) {
      getArticleList()
        .then(articles => {
          // 只返回必要的字段，减少数据量
          const simplifiedArticles = articles.map(article => ({
            id: article.id,
            name: article.name,
            createTime: article.createTime,
            updateTime: article.updateTime,
            type: article.type,
            preview: article.preview,
            categoryId: article.categoryId,
            folder: article.folder
          }));
          
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            code: 0,
            message: '获取成功',
            data: simplifiedArticles
          }));
        })
        .catch(e => {
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            code: 500,
            message: `获取文章列表失败: ${e.message}`,
            data: null
          }));
        });
      return;
    }
    
    // 获取文章详情
    if (req.method === 'GET' && req.url.startsWith('/mcp/article/')) {
      const id = parsedUrl.pathname.split('/').pop();
      if (!id || isNaN(Number(id))) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          code: 400,
          message: '无效的文章ID',
          data: null
        }));
        return;
      }
      
      getArticleById(id)
        .then(article => {
          if (!article) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
              code: 404,
              message: '文章不存在',
              data: null
            }));
            return;
          }
          
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            code: 0,
            message: '获取成功',
            data: article
          }));
        })
        .catch(e => {
          res.writeHead(500, {'Content-Type': 'application/json'});
          res.end(JSON.stringify({
            code: 500,
            message: `获取文章详情失败: ${e.message}`,
            data: null
          }));
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
