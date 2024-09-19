import {IDomEditor} from "@wangeditor/editor";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";

export function onRichTextImport(id: number, articleId?: number, editorRef?: IDomEditor) {
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
            let article = await useArticleStore().getArticleById(articleId);
            if (res.type === 1) {
                MessageUtil.warning('暂不支持导出markdown文档');
            } else if (res.type === 2) {
                const html = editorRef?.getHtml();
                if (html) {
                    download(html, `${article?.index.name || 'article'}.html`, 'text/html')
                }
            } else if (res.type === 3) {
                const text = editorRef?.getText();
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
