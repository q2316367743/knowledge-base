import {useErrorStore} from "@/store/components/ErrorStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export function openTodoWidget(id: number, onSuccess: (instance: BrowserWindow.WindowInstance) => void) {
  // 打开笔记预览
  const dev = InjectionUtil.isDev();
  const ubWindow = InjectionUtil.createBrowserWindow(
    dev ? 'test.html' : `dist/todo.html`, {
      // @ts-ignore
      useContentSize: true,
      width: 460,
      height: 600,
      minWidth: 460,
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
          ubWindow.webContents.executeJavaScript(`location.href = 'http://localhost:5173/todo.html?todo-id=${id}'`)
            .then(() => console.debug("代码执行成功"))
            .catch((e: any) => console.error("代码执行失败", e));
          ubWindow.webContents.openDevTools();
        } else if (useErrorStore().consoleShow) {
          ubWindow.webContents.openDevTools();
        }
        window.preload.ipcRenderer.sendMessage(ubWindow.webContents.id, 'todo:to', {
          event: '/todo/init/id',
          data: {
            id: id
          },
        });
        onSuccess(ubWindow);
      } catch (e) {
        MessageUtil.error("打开小窗失败", e);
      }
    })
}