import {defineStore} from "pinia";
import MessageUtil from "@/utils/modal/MessageUtil";

export const useTodoWidgetStore = defineStore('todo-widget', () => {
  // 待办窗口
  const widgets = ref(new Map<number, BrowserWindow.WindowInstance>());
  // 打开的窗口
  const todoIds = computed(() => widgets.value.keys());
  // 是否是空的待办窗口
  const emptyTodoWidget = computed(() => widgets.value.size === 0);

  // 新增一个小部件
  const addWidget = (id: number, value: BrowserWindow.WindowInstance) => {
    widgets.value.set(id, value);
  }

  // 删除一个小部件
  const deleteWidget = (id: number) => {
    widgets.value.delete(id);
  }

  // 检测小部件是否都有效
  const checkWidget = () => {
    const ids = widgets.value.keys();
    for (const id of ids) {
      const widget = widgets.value.get(id);
      if (widget) {
        // 测试接口
        try {
          let destroyed = widget.isDestroyed();
          if (destroyed) {
            // 已销毁
            deleteWidget(id);
          }
        } catch (e) {
          MessageUtil.error(`待办「${id}」窗口已失效`, e);
          deleteWidget(id);
        }
      }
    }
  }

  return {
    todoIds, emptyTodoWidget, addWidget, deleteWidget, checkWidget
  }

})