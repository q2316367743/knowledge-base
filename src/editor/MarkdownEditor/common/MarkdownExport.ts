import JSZip from "jszip";
import Cherry from "cherry-markdown";
import {createArticleExport} from "@/pages/note/layout/editor-content/components/ArticleExport";
import {download} from "@/utils/BrowserUtil";
import cherryMarkdownCss from 'cherry-markdown/dist/cherry-markdown.markdown.min.css?raw';
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {getAttachment} from "@/utils/utools/AttachmentUtil";

interface ImageItem {
  key: string;
  path: string;
}

export function openMarkdownExport(id: number, cherry: Cherry) {
  createArticleExport(id, [{
    key: 1,
    name: 'markdown',
    desc: '默认格式',
    extname: 'md'
  }, {
    key: 2,
    name: 'PDF',
    desc: '易于打印',
    extname: 'pdf'
  }, {
    key: 3,
    name: '图片',
    desc: '易于分享',
    extname: 'png'
  }, {
    key: 4,
    name: 'html',
    desc: '易于复制',
    extname: 'html'
  }, {
    key: 5,
    name: '微信公众号',
    desc: '转为微信公众号排版',
    extname: ''
  }]).then(async res => {
    if (res.type === 1) {
      // 导出图片
      const markdown = cherry.getMarkdown();
      const images = new Array<ImageItem>();
      const replacedStr = markdown.replace(/!\[.*]\(attachment:(.+)\)/g, (match, p1) => {
        let code = p1.match(/\d+/);
        images.push({
          key: code[0],
          path: p1
        })
        return `![](./image/${code[0]}.png)`;
      });
      if (images.length === 0) {
        // 文件导出
        download(markdown, res.title + '.md', 'text/plain')
      } else {
        const jsZip = new JSZip();
        jsZip.file('index.md', replacedStr);
        // 附件导出
        for (let image of images) {
          const data = getAttachment(image.path);
          if (data) {
            const blob = new Blob([data]);
            jsZip.file(`image/${image.key}.png`, blob);
          }
        }
        jsZip.generateAsync({type: 'blob'}).then(content => {
          download(content, res.title + '.zip', 'application/zip');
        });
      }
    } else if (res.type === 4) {
      // html
      const previewer = cherry.wrapperDom.querySelector('.cherry-previewer');
      if (previewer) {
        const html = previewer.innerHTML;
        // 使用DomParser解析html标签，将 img 标签的 src 使用http请求获取到blob对象，将其转为base64，替换原img的src
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<html lang="zh"><body>${html}</body></html>`, 'text/html');
        const imgItems = doc.querySelectorAll('img');
        if (!imgItems) {
          return;
        }
        for (let i = 0; i < imgItems.length; i++) {
          const img = imgItems[i];
          const src = img.getAttribute('src');
          if (src) {
            const rsp = await fetch(src);
            if (rsp.ok) {
              const blob = await rsp.blob();
              // 将blob转为base64
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(new Blob([blob], {type: 'image/png'}));
              });
              img.setAttribute('src', base64);
            }
          }
        }
        download(`<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="referrer" content="never">
  <title>${res.title}</title>
  <style>${cherryMarkdownCss}</style>
  <style>
    .knowledge-base {
      width:  1200px;
      margin: 16px auto;
    }
    .copy-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 5px 8px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 3px;
    }
    .copy-btn.disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body class="cherry-markdown knowledge-base">
${doc.body.innerHTML}
</body>
<script>
// 页面加载完成后生成目录
document.addEventListener('DOMContentLoaded', function() {
  // 创建目录容器
  const tocContainer = document.createElement('div');
  tocContainer.className = 'toc-container';
  tocContainer.style.cssText = 'position: fixed; right: 20px; top: 80px; max-width: 250px; max-height: 80vh; overflow-y: auto; background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;';
  
  // 创建目录标题
  const tocTitle = document.createElement('div');
  tocTitle.textContent = '目录';
  tocTitle.style.cssText = 'font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;';
  tocContainer.appendChild(tocTitle);
  
  // 创建目录列表
  const tocList = document.createElement('ul');
  tocList.style.cssText = 'list-style: none; padding: 0; margin: 0;';
  tocContainer.appendChild(tocList);
  
  // 获取所有标题元素
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  // 如果没有标题，不显示目录
  if (headings.length === 0) {
    return;
  }
  
  // 为每个标题添加ID（如果没有）
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
  });
  
  // 生成目录
  const tocItems = [];
  headings.forEach((heading) => {
    // 获取标题级别
    const level = parseInt(heading.tagName.substring(1));
    
    // 创建目录项
    const listItem = document.createElement('li');
    listItem.style.cssText = \`margin: 5px 0; padding-left: \${(level - 1) * 15}px; font-size: \${16 - (level - 1)}px;\`;
    
    // 创建链接
    const link = document.createElement('a');
    link.textContent = heading.textContent;
    link.href = '#' + heading.id;
    link.style.cssText = 'text-decoration: none; color: #333; display: block;';
    
    // 添加点击事件
    link.addEventListener('click', function(e) {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
    tocItems.push(listItem);
  });
  
  // 添加目录到页面
  document.body.appendChild(tocContainer);
  
  // 添加滚动监听，高亮当前可见的标题
  window.addEventListener('scroll', function() {
    // 获取当前可见的标题
    let currentHeadingIndex = 0;
    headings.forEach((heading, index) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100) { // 标题在视口顶部以下100px认为是当前标题
        currentHeadingIndex = index;
      }
    });
    
    // 高亮当前标题对应的目录项
    tocItems.forEach((item, index) => {
      if (index === currentHeadingIndex) {
        item.firstChild.style.fontWeight = 'bold';
        item.firstChild.style.color = '#1e88e5';
      } else {
        item.firstChild.style.fontWeight = 'normal';
        item.firstChild.style.color = '#333';
      }
    });
  });
  
  // 添加目录切换按钮
  const toggleButton = document.createElement('div');
  toggleButton.textContent = '≡';
  toggleButton.style.cssText = 'position: fixed; right: 20px; top: 20px; width: 30px; height: 30px; background-color: #1e88e5; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; z-index: 1001; font-size: 20px;';
  
  let tocVisible = true;
  toggleButton.addEventListener('click', function() {
    tocVisible = !tocVisible;
    tocContainer.style.display = tocVisible ? 'block' : 'none';
  });
  
  document.body.appendChild(toggleButton);
  
  // 给每一个pre标签右上角都加入复制按钮
  document.querySelectorAll('pre').forEach(pre => {
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.textContent = '复制';

    copyButton.addEventListener('click', () => {
      if (copyButton.classList.contains('disabled')) return;

      // 创建一个临时的 textarea 元素
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = pre.querySelector('code').innerText;
      document.body.appendChild(tempTextarea);

      // 选择并复制文本
      tempTextarea.select();
      document.execCommand('copy');

      // 移除临时的 textarea 元素
      document.body.removeChild(tempTextarea);

      copyButton.textContent = '复制成功';
      copyButton.classList.add('disabled');

      setTimeout(() => {
        copyButton.textContent = '复制';
        copyButton.classList.remove('disabled');
      }, 2000);
    });

    pre.style.position = 'relative';
    pre.appendChild(copyButton);
  });
});
</script>
<link href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/viewerjs/1.10.4/viewer.min.css" type="text/css" rel="stylesheet" />
<script type="module">
    import Viewer from 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/viewerjs/1.10.4/viewer.esm.min.js';
    const gallery = new Viewer(document.body);
</script>
</html>
`, res.title + '.html', 'text/html');
      }
    } else if (res.type === 5) {
      await InjectionUtil.browser.openMd(cherry.getMarkdown());
    } else {
      cherry.export(renderType(res.type), res.title);
    }
  })
}

function renderType(type: number) {
  switch (type) {
    case 2:
      return 'pdf';
    case 3:
      return 'img';
    case 4:
      return 'html';
    default:
      return 'markdown';
  }
}
