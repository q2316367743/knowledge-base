import MindMap from "simple-mind-map";
import {createArticleExport} from "@/pages/note/layout/editor-content/components/ArticleExport";
import MessageUtil from "@/utils/modal/MessageUtil";

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
      (async () => {
        if (res.type === 1) {
          await mindMap.export('png', true, res.title);
        } else if (res.type === 2) {
          await mindMap.export('svg', true, res.title);
        } else if (res.type === 3) {
          await mindMap.export('pdf', true, res.title);
        } else if (res.type === 4) {
          await mindMap.export('md', true, res.title);
        } else if (res.type === 5) {
          await mindMap.export('xmind', res.title);
        }
      })().then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e));
    })

}
