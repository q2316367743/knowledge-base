import {defineStore} from "pinia";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openTodoWidget} from "@/widget/Todo";
import {checkPower} from "@/store";

export const useTodoWidgetStore = defineStore('todo-widget', () => {
  // 待办窗口
  const widgets = ref(new Map<number, BrowserWindow.WindowInstance>());
  // 打开的窗口
  const todoIds = computed(() => new Set(widgets.value.keys()));
  // 是否是空的待办窗口
  const emptyTodoWidget = computed(() => widgets.value.size === 0);

  // 检测小部件是否都有效
  const checkWidget = () => {
    const ids = Array.from(widgets.value.keys());
    for (const id of ids) {
      const widget = widgets.value.get(id);
      if (widget) {
        // 测试接口
        try {
          let destroyed = widget.isDestroyed();
          if (destroyed) {
            // 已销毁
            widgets.value.delete(id);
          }
        } catch (e) {
          MessageUtil.error(`待办「${id}」窗口已失效`, e);
          widgets.value.delete(id);
        }
      }
    }
  }

  /**
   * 新增一个小部件
   * @param id 待办清单ID
   */
  const openWidget = async (id: number) => {
    await checkPower('todo')
    // 先去检查所有的小部件存活状态
    checkWidget();
    // 先判断是否存在
    if (widgets.value.has(id)) {
      return;
    }
    // 打开小部件
    openTodoWidget(id, (instance) => {
      widgets.value.set(id, instance);
    });
  }

  // 删除一个小部件
  const closeWidget = (id: number) => {
    const widget = widgets.value.get(id);
    if (widget) {
      try {
        widget.close();
      } finally {
        widgets.value.delete(id);
      }
    }
  }

  return {
    todoIds, emptyTodoWidget, checkWidget, openWidget, closeWidget,
  }

})