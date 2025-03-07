import JSZip from "jszip";
import Cherry from "cherry-markdown";
import {createArticleExport} from "@/pages/note/layout/editor-content/components/ArticleExport";
import {download} from "@/utils/BrowserUtil";
import cherryMarkdownCss from 'cherry-markdown/dist/cherry-markdown.markdown.min.css?raw';

interface ImageItem {
  key: string;
  path: string;
}

export function openMarkdownExport(id: number, cherry: Cherry) {
  createArticleExport(id, [{
    key: 1,
    name: 'markdown',
    desc: '默认格式'
  }, {
    key: 2,
    name: 'PDF',
    desc: '易于打印'
  }, {
    key: 3,
    name: '图片',
    desc: '易于分享'
  }, {
    key: 4,
    name: 'html',
    desc: '易于复制'
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
      console.log(images);
      if (images.length === 0) {
        // 文件导出
        download(markdown, res.title + '.md', 'text/plain')
      } else {
        const jsZip = new JSZip();
        jsZip.file('index.md', replacedStr);
        // 附件导出
        for (let image of images) {
          const data = utools.db.getAttachment(image.path);
          if (data) {
            const blob = new Blob([data]);
            jsZip.file(`image/${image.key}.png`, blob);
          }
        }
        jsZip.generateAsync({type: 'blob'}).then(content => {
          download(content, res.title + '.zip', 'application/zip');
        });
      }
    }
    else if (res.type === 4) {
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
                reader.readAsDataURL(new Blob([blob], { type: 'image/png' }));
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
  </style>
</head>
<body class="cherry-markdown knowledge-base">
${doc.body.innerHTML}
</body>
</html>
`, res.title + '.html', 'text/html');
      }
    }
    else {
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
