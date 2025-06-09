import {useErrorStore} from "@/store/components/ErrorStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export function openNotePreview(id: number) {
  // 打开笔记预览
  const dev = InjectionUtil.isDev();
  const ubWindow = InjectionUtil.createBrowserWindow(
    'preview.html', {
      // @ts-ignore
      useContentSize: true,
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      hasShadow: false,
      alwayOnTop: true,
      backgroundColor: '#00000000',
      params: {
        'article-id': `${id}`
      }
    });
  ubWindow.open(winId => {
    InjectionUtil.native.ipcRenderer.sendMessage(winId, 'preview', {
      event: 'config',
      data: {
        id: id,
      }
    })
  })
}