import Cherry from "cherry-markdown";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";

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
        cherry.export(renderType(res.type), res.title);
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
