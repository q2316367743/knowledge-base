import Cherry from "cherry-markdown";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";

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
    }]).then(res => {
        console.log(res);
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
            if (images.length ===0) {
                // 文件导出
                download(markdown, res.title + '.md', 'text/plain')
            }else {
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
        }else {
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
