import {homeEditorId} from "@/store/components/HomeEditorStore";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {WindowUtil} from "@/utils/utools/WindowUtil";

/**
 * 打开AI聊天小部件
 */
export function openAiChatWidget() {
  const {x, y} = InjectionUtil.getCursorScreenPoint();
  const ubWindow = WindowUtil.createBrowserWindow(
    'chat.html', {
      useContentSize: true,
      width: 400,
      height: 700,
      minWidth: 400,
      minHeight: 600,
      hasShadow: false,
      backgroundColor: '#00000000',
      x: x + 64,
      y: y - 72
    });
  ubWindow.open(() => {
    ubWindow.sendMessage('chat', {
      event: 'config',
      data: {
        id: homeEditorId.value,
        name: useArticleStore().articleMap.get(homeEditorId.value)?.name
      }
    })
  })
}