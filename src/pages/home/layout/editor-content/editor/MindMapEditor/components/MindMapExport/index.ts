import MindMap from "simple-mind-map";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";

const items = [{
    key: 1,
    name: '图片',
    desc: '适合查看分享'
}, {
    key: 2,
    name: 'SVG',
    desc: '可缩放矢量图形'
}, {
    key: 3,
    name: 'PDF',
    desc: '适合打印'
}, {
    key: 4,
    name: 'Markdown',
    desc: '便于其他软件打开'
}, {
    key: 5,
    name: 'XMind',
    desc: 'XMind格式'
}]

export function openMindMapExport(mindMap: MindMap, id: number) {
    createArticleExport(id, items)
        .then(res => {
            if (res.type === 1) {
                mindMap.export('png', true, res.title);
            } else if (res.type === 2) {
                mindMap.export('svg', true, res.title);
            } else if (res.type === 3) {
                mindMap.export('pdf', true, res.title);
            } else if (res.type === 4) {
                mindMap.export('md', true, res.title);
            } else if (res.type === 5) {
                mindMap.export('xmind', res.title);
            }
    })

}
