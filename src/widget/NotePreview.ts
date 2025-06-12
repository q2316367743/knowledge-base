import {WindowUtil} from "@/utils/utools/WindowUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openNotePreview(id: number) {
  // 打开笔记预览
  const ubWindow = WindowUtil.createBrowserWindow(
    'preview',
    'preview.html', {
      // @ts-ignore
      useContentSize: true,
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      hasShadow: false,
      alwaysOnTop: true,
      backgroundColor: '#00000000',
      params: {
        'article-id': `${id}`
      }
    });
  ubWindow.open().then(() => {
    ubWindow.sendMessage('preview', {
      event: 'config',
      data: {
        id: id,
      }
    })
  }).catch(e => MessageUtil.error("打开窗口失败", e))
}