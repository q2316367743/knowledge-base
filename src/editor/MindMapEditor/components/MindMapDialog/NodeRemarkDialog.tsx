import Cxt from '@imengyu/vue3-context-menu';
/**
 * 节点内容备注对话框
 * @param content html内容
 * @param left 左边距
 * @param top 上边距
 */
export function handleNodeRemarkDialog(content: string, left: number, top: number) {
  Cxt.showContextMenu({
    x: left,
    y: top,
    items: [{
      label: content
    }]
  })
}