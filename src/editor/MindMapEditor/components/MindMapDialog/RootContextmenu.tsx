import MindMap from "simple-mind-map";
import Ctx from '@imengyu/vue3-context-menu';
import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {useGlobalStore} from "@/store";

export function handleRootContextmenu(e: PointerEvent, mindMap: MindMap) {
  Ctx.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items: [{
      label: '回到根节点',
      onClick: () => {
        mindMap.execCommand('RETURN_CENTER')
      }
    }, {
      label: "展开所有",
      onClick: () => {
        mindMap.execCommand('EXPAND_ALL')
      }
    }, {
      label: "收起所有",
      onClick: () => {
        mindMap.execCommand('UNEXPAND_ALL')
      }
    }, {
      label: "一键整理布局",
      onClick: () => {
        mindMap.execCommand('RESET_LAYOUT')
      }
    }]
  })
}