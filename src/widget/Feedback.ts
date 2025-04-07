import MessageUtil from "@/utils/modal/MessageUtil";
import {useErrorStore} from "@/store/components/ErrorStore";

export function openFeedbackWidget() {
  const dev = utools.isDev();
  const ubWindow = utools.createBrowserWindow(
    dev ? 'test.html' : `dist/feedback.html`, {
      // @ts-ignore
      useContentSize: true,
      width: 400,
      height: 700,
      minWidth: 400,
      minHeight: 600,
      hasShadow: false,
      backgroundColor: '#00000000',
      webPreferences: {
        preload: 'preload.js',
        zoomFactor: 0,
        devTools: dev
      },
    }, () => {
      try {
        ubWindow.show();
        if (dev) {
          ubWindow.webContents.executeJavaScript(`location.href = 'http://localhost:5173/feedback.html'`)
            .then(() => console.debug("代码执行成功"))
            .catch((e: any) => console.error("代码执行失败", e));
          ubWindow.webContents.openDevTools();
        } else if (useErrorStore().consoleShow) {
          ubWindow.webContents.openDevTools();
        }
      } catch (e) {
        MessageUtil.error("打开小窗失败", e);
      }
    })
}