import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {CustomerWindow, WindowUtil} from "@/utils/utools/WindowUtil";

export function openTodoWidget(id: number, name: string, onSuccess: (instance: CustomerWindow) => void) {
  // 打开笔记预览
  const dev = InjectionUtil.isDev();
  const ubWindow = WindowUtil.createBrowserWindow(
    'todo.html', {
      // @ts-ignore
      useContentSize: true,
      width: 460,
      height: 600,
      minWidth: 460,
      minHeight: 600,
      hasShadow: false,
      alwayOnTop: true,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      params: {
        'todo-id': `${id}`,
        'todo-name': name
      }
    });
  ubWindow.open(id => {
    window.preload.ipcRenderer.sendMessage(id, 'todo:to', {
      event: '/todo/init/id',
      data: {
        id: id,
        name: name
      },
    });
    onSuccess(ubWindow);
  })
}