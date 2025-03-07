import {KanbanDataNode} from "@/editor/SuperEditor/tools/KanbanTool/types";
import {DialogPlugin} from "tdesign-vue-next";


export function openKanbanNodeInfo(node: KanbanDataNode) {
  // 寻找
  DialogPlugin({
    header: node.name,
    placement: 'center',
    draggable: true,
    width: 650,
    footer: false,
    default: () => <div innerHTML={node.content}></div>,
  })
}