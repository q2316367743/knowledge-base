import {homeEditorId} from "@/store/components/HomeEditorStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";

/**
 * 打开AI聊天小部件
 */
export function openAiChatWidget() {
  const dev = utools.isDev();
  const {x, y} = utools.getCursorScreenPoint();
  const ubWindow = utools.createBrowserWindow(
    dev ? 'test.html' : `dist/chat.html`, {
      // @ts-ignore
      useContentSize: true,
      width: 400,
      height: 700,
      minWidth: 400,
      minHeight: 600,
      hasShadow: false,
      backgroundColor: '#00000000',
      webPreferences: {
        preload: 'sub-window.js',
        zoomFactor: 0,
        devTools: dev
      },
      x: x + 64,
      y: y - 72
    }, () => {
      try {
        ubWindow.show();
        if (dev) {
          ubWindow.webContents.executeJavaScript(`location.href = 'http://localhost:5173/chat.html'`)
            .then(() => console.log("代码执行成功"))
            .catch((e: any) => console.error("代码执行失败", e));
          ubWindow.webContents.openDevTools();
        }
        window.preload.ipcRenderer.sendMessage(ubWindow.webContents.id, 'chat', {
          type: 'config',
          value: {
            id: homeEditorId.value,
            name: useArticleStore().articleMap.get(homeEditorId.value)?.name
          }
        })
      } catch (e) {
        MessageUtil.error("打开小窗失败", e);
      }
    })
}