import {IDomEditor} from "@wangeditor/editor";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import JSZip from "jszip";
import {getAttachmentByAsync} from "@/utils/utools/DbStorageUtil";
import {renderAttachmentBaseUrl} from "@/plugin/server";

export function onRichTextExport(id: number, articleId?: number, editorRef?: IDomEditor) {
    if (articleId === id) {
        createArticleExport(id, [{
            key: 1,
            name: 'Markdown',
            desc: '暂不支持'
        }, {
            key: 2,
            name: 'HTML',
            desc: '便于发布'
        }, {
            key: 3,
            name: '纯文本',
            desc: '便于阅读'
        }, {
            key: 4,
            name: 'Word文档',
            desc: '暂不支持'
        }]).then(async res => {
            if (!articleId) {
                return;
            }
            if (!editorRef) {
                return;
            }
            let article = await useArticleStore().getArticleById(articleId);
            if (res.type === 1) {
                MessageUtil.warning('暂不支持导出markdown文档');
            } else if (res.type === 2) {
                const html = editorRef.getHtml();
                if (html) {
                    // 此处需要将html中图片、视频的src中的链接替换为绝对路径
                    const attachments = new Array<string>();
                    const document = new DOMParser().parseFromString(html, 'text/html');
                    const baseUrl = renderAttachmentBaseUrl();
                    document.body.querySelectorAll('img, video, source').forEach(item => {
                        const src = item.getAttribute('src');
                        if (src) {
                            if (src.startsWith(baseUrl)) {
                                // 获取key
                                let key = new URL(src).searchParams.get('key');
                                if (key) {
                                    // 获取key，
                                    attachments.push(key);
                                    // 替换src
                                    item.setAttribute('src', key.substring(1))
                                }
                            }
                        }
                    });
                    if (attachments.length > 0) {
                        // zip压缩
                        let htmlStr = document.body.innerHTML;
                        const zip = new JSZip();
                        zip.file('index.html', htmlStr);
                        for (let attachment of attachments) {
                            const blob = await getAttachmentByAsync(attachment);
                            if (blob) {
                                zip.file(attachment, blob);
                            }
                        }
                        const content = await zip.generateAsync({type: 'blob'});
                        download(content, `${article?.index.name || 'article'}.zip`, 'application/zip')
                    } else {
                        // 直接下载
                        download(html, `${article?.index.name || 'article'}.html`, 'text/html')
                    }
                }
            } else if (res.type === 3) {
                const text = editorRef.getText();
                if (text) {
                    download(text, `${article?.index.name || 'article'}.txt`, 'text/plain')
                }
            } else if (res.type === 4) {
                MessageUtil.warning('暂不支持导出Word文档');
            } else {
                MessageUtil.error('导出失败，类型不支持');
            }
        })
    }
}
