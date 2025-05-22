import {defineStore} from "pinia";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openTodoWidget} from "@/widget/Todo";
import {checkPower, useTodoWrapStore} from "@/store";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export const useTodoWidgetStore = defineStore('todo-widget', () => {
  // 待办窗口
  const widgets = ref(new Map<number, BrowserWindow.WindowInstance>());
  // 打开的窗口
  const todoIds = computed(() => new Set(widgets.value.keys()));
  // 是否是空地待办窗口
  const emptyTodoWidget = computed(() => widgets.value.size === 0);

  const handleCloseWidget = (id: number) => {
    if (useTodoWrapStore().categoryId === id) {
      useTodoWrapStore().init(id, false).catch(e => MessageUtil.error("初始化待办失败", e));
      // 显示主窗口
      InjectionUtil.showMainWindow();
    }
  }

  // 初始化后监听事件
  window.preload.ipcRenderer.receiveMessage('todo:from', (msg) => {
    const {event, data} = msg;
    if (event === '/todo/operator/toggleTop') {
      const {id} = data;
      if (widgets.value.has(id)) {
        const widget = widgets.value.get(id);
        if (widget) {
          widget.setAlwaysOnTop(!widget.isAlwaysOnTop());
          window.preload.ipcRenderer.sendMessage(widget.webContents.id, 'todo:to', {
            event: '/todo/status/alwaysOnTop',
            data: {
              alwaysOnTop: widget.isAlwaysOnTop()
            },
          });
        }
      }
    } else if (event === '/todo/operator/close') {
      const {id} = data;
      if (widgets.value.has(id)) {
        const widget = widgets.value.get(id);
        if (widget) {
          widget.close();
          widgets.value.delete(id);
          // 如果当前是小部件，则刷新
          handleCloseWidget(id);
        }
      }
    } else if (event === '/todo/operator/minimize') {
      const {id} = data;
      if (widgets.value.has(id)) {
        const widget = widgets.value.get(id);
        if (widget) {
          widget.minimize();
        }
      }
    }
  })

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
            // 如果当前是小部件，则刷新
            handleCloseWidget(id);
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
   * @param name 待办清单名称
   */
  const openWidget = async (id: number, name: string) => {
    await checkPower('todo')
    // 先去检查所有的小部件存活状态
    checkWidget();
    // 先判断是否存在
    if (widgets.value.has(id)) {
      return;
    }
    // 打开小部件
    openTodoWidget(id, name, (instance) => {
      widgets.value.set(id, instance);
      // 隐藏主窗口
      InjectionUtil.hideMainWindow();
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