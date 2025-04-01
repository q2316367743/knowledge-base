import {useErrorStore} from "@/store/components/ErrorStore";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openNotePreview(id: number) {
  // 打开笔记预览

  const dev = utools.isDev();
  const ubWindow = utools.createBrowserWindow(
    dev ? 'test.html' : `dist/preview.html`, {
      // @ts-ignore
      useContentSize: true,
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      hasShadow: false,
      alwayOnTop: true,
      backgroundColor: '#00000000',
      webPreferences: {
        preload: 'sub-window.js',
        zoomFactor: 0,
        devTools: dev
      },
    }, () => {
      try {
        ubWindow.show();
        if (dev) {
          ubWindow.webContents.executeJavaScript(`location.href = 'http://localhost:5173/preview.html?article-id=${id}'`)
            .then(() => console.debug("代码执行成功"))
            .catch((e: any) => console.error("代码执行失败", e));
          ubWindow.webContents.openDevTools();
        } else if (useErrorStore().consoleShow) {
          ubWindow.webContents.openDevTools();
        }
        window.preload.ipcRenderer.sendMessage(ubWindow.webContents.id, 'preview', {
          id: id,
        })
      } catch (e) {
        MessageUtil.error("打开小窗失败", e);
      }
    })
}