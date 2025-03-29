import ContextMenu from '@imengyu/vue3-context-menu';
import {CheckIcon, DeleteIcon, FlagIcon, ThumbDownIcon} from "tdesign-icons-vue-next";
import {useGlobalStore} from "@/store";
import {handlePriorityColor, TodoItemIndex, TodoItemPriority, TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

function updatePriority(id: number, priority: TodoItemPriority) {
  useGlobalStore().startLoading("开始更新待办项");
  useTodoItemStore().updateById(id, {priority})
    .then(() => MessageUtil.success("更新成功"))
    .catch(e => MessageUtil.error("更新失败", e))
    .finally(() => useGlobalStore().closeLoading());
}

async function _updateStatusToAbandon(itemId: number): Promise<TodoItemIndex> {
  // 实时查询
  const attr = await useTodoItemStore().getTodoItemAttr(itemId);
  const reason = await MessageBoxUtil.prompt("请输入放弃原因", "放弃待办", {
    confirmButtonText: "放弃",
    cancelButtonText: "取消",
    inputValue: attr.reason
  });
  const record = await useTodoItemStore()
    .updateById(itemId, {status: TodoItemStatus.ABANDON}, {reason})
  return Promise.resolve(record);
}

function updateStatusToAbandon(itemId: number) {
  useGlobalStore().startLoading("开始更新待办项");
  _updateStatusToAbandon(itemId)
    .then(record => {
      if (record.status === TodoItemStatus.COMPLETE) {
        MessageUtil.success(`【${record.title}】已完成`)
      }
    })
    .catch(e => {
      MessageUtil.error("更新失败", e)
    })
    .finally(() => useGlobalStore().closeLoading());
}

function removeById(id: number) {
  MessageBoxUtil.confirm("是否删除该待办项？", "删除提示", {
    confirmButtonText: "删除"
  }).then(() => {
    useGlobalStore().startLoading("开始删除待办项");
    useTodoItemStore().deleteById(id)
      .then(() => MessageUtil.success("删除成功"))
      .catch(e => MessageUtil.error("删除失败", e))
      .finally(() => useGlobalStore().closeLoading());
  })
}

export function onContentDefaultItem(e: MouseEvent, item: TodoItemIndex) {
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items: [
      {
        label: '优先级',
        icon: () => <FlagIcon/>,
        children: [{
          label: () => <div style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</div>,
          icon: () => item.priority === TodoItemPriority.HIGH ?
            <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}/> : <div></div>,
          onClick: () => updatePriority(item.id, TodoItemPriority.HIGH)
        }, {
          label: () => <div style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</div>,
          icon: () => item.priority === TodoItemPriority.MIDDLE ?
            <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}/> : <div></div>,
          onClick: () => updatePriority(item.id, TodoItemPriority.MIDDLE)
        }, {
          label: () => <div style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</div>,
          icon: () => item.priority === TodoItemPriority.FLOOR ?
            <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}/> : <div></div>,
          onClick: () => updatePriority(item.id, TodoItemPriority.FLOOR)
        }, {
          label: () => <div style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</div>,
          icon: () => item.priority === TodoItemPriority.NONE ?
            <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.NONE)}}/> : <div></div>,
          onClick: () => updatePriority(item.id, TodoItemPriority.NONE)
        }]
      }, {
        label: () => <div style={{color: 'rgb(var(--orange-6))'}}>放弃</div>,
        icon: () => <ThumbDownIcon style={{color: 'rgb(var(--orange-6))'}}/>,
        onClick: () => updateStatusToAbandon(item.id)
      }, {
        label: () => <div style={{color: 'rgb(var(--red-6))'}}>删除</div>,
        icon: () => <DeleteIcon style={{color: 'rgb(var(--red-6))'}}/>,
        onClick: () => removeById(item.id)
      }
    ]
  })
}