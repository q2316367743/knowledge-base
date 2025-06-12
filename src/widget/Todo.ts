import {CustomerWindow, WindowUtil} from "@/utils/utools/WindowUtil";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openTodoWidget(id: number, name: string, onSuccess: (instance: CustomerWindow) => void) {
  // 打开笔记预览
  const ubWindow = WindowUtil.createBrowserWindow(
    'todo',
    'todo.html', {
      // @ts-ignore
      useContentSize: true,
      width: 460,
      height: 600,
      minWidth: 460,
      minHeight: 600,
      hasShadow: false,
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      backgroundColor: '#00000000',
      params: {
        'todo-id': `${id}`,
        'todo-name': name
      }
    });
  ubWindow.open().then(() => {
    ubWindow.sendMessage('todo:to', {
      event: '/todo/init/id',
      data: {
        id: id,
        name: name
      },
    });
    onSuccess(ubWindow);
  }).catch(e => MessageUtil.error("创建窗口失败", e))
}