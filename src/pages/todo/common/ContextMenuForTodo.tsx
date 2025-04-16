import ContextMenu, {MenuItem} from '@imengyu/vue3-context-menu';
import {CheckIcon, DeleteIcon, EditIcon, FlagIcon, RollbackIcon, ThumbDownIcon} from "tdesign-icons-vue-next";
import {useGlobalStore} from "@/store";
import {
  getNextTodoItemStatus,
  handlePriorityColor,
  TodoItemIndex,
  TodoItemPriority,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useUmami} from "@/plugin/umami";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";

/**
 * 更新优先级
 * @param id 待办ID
 * @param priority 优先级
 */
function updatePriority(id: number, priority: TodoItemPriority) {
  return new Promise<void>(resolve => {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoItemStore().updateById(id, {priority})
      .then(() => {
        MessageUtil.success("更新成功");
        resolve();
      })
      .catch(e => MessageUtil.error("更新失败", e))
      .finally(() => useGlobalStore().closeLoading());
  })
}

/**
 * 更新状态
 * @param itemId 待办ID
 * @param status 当前的状态
 */
export function updateStatus(itemId: number, status: TodoItemStatus) {
  return new Promise<void>(resolve => {
    useTodoItemStore().updateById(itemId, {status: getNextTodoItemStatus(status)})
      .then(record => {
        if (record.status === TodoItemStatus.COMPLETE) {
          MessageUtil.success(`【${record.title}】已完成`);
          useUmami.track('/待办/状态/完成');
        } else if (record.status === TodoItemStatus.ABANDON) {
          useUmami.track('待办/状态/放弃');
        }
        resolve();
      })
      .catch(e => MessageUtil.error("更新失败", e));
  })
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

/**
 * 放弃待办
 * @param itemId 待办ID
 */
function updateStatusToAbandon(itemId: number) {
  return new Promise<void>(resolve => {
    _updateStatusToAbandon(itemId)
      .then(record => {
        MessageUtil.success(`【${record.title}】已放弃`);
        resolve();
      })
      .catch(e => MessageUtil.error("更新失败", e))
  });
}

/**
 * 删除待办
 * @param id 待办ID
 */
function removeById(id: number) {
  return new Promise<void>(resolve => {
    MessageBoxUtil.confirm("是否删除该待办项？", "删除提示", {
      confirmButtonText: "删除"
    }).then(() => {
      useGlobalStore().startLoading("开始删除待办项");
      useTodoItemStore().deleteById(id)
        .then(() => {
          MessageUtil.success("删除成功");
          resolve();
        })
        .catch(e => MessageUtil.error("删除失败", e))
        .finally(() => useGlobalStore().closeLoading());
    })
  });
}

/**
 * 切换置顶待办
 * @param id 待办ID
 * @param top 是否置顶
 */
export const toggleTop = (id: number, top: boolean) => useTodoItemStore().updateById(id, {top})
  .then(() => MessageUtil.success(top ? "已置顶" : "取消置顶"))
  .catch(e => MessageUtil.error((top ? "置顶" : "取消置顶") + "失败", e));

/**
 * 右键菜单
 * @param e 事件
 * @param item 待办项
 * @param toUpdate 更新成功回调
 */
export function onContextMenuForTodo(e: MouseEvent, item: TodoItemIndex, toUpdate?: (index: TodoItemIndex) => void) {
  const items = new Array<MenuItem>();
  items.push({
    label: '编辑',
    icon: () => <EditIcon/>,
    onClick: () => openTodoItemSetting(item, toUpdate)
  }, {
    label: '优先级',
    icon: () => <FlagIcon/>,
    children: [{
      label: () => <div style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</div>,
      icon: () => item.priority === TodoItemPriority.HIGH ?
        <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}/> : <div></div>,
      onClick: () => updatePriority(item.id, TodoItemPriority.HIGH).then(() => toUpdate && toUpdate(item))
    }, {
      label: () => <div style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</div>,
      icon: () => item.priority === TodoItemPriority.MIDDLE ?
        <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}/> : <div></div>,
      onClick: () => updatePriority(item.id, TodoItemPriority.MIDDLE).then(() => toUpdate && toUpdate(item))
    }, {
      label: () => <div style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</div>,
      icon: () => item.priority === TodoItemPriority.FLOOR ?
        <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}/> : <div></div>,
      onClick: () => updatePriority(item.id, TodoItemPriority.FLOOR).then(() => toUpdate && toUpdate(item))
    }, {
      label: () => <div style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</div>,
      icon: () => item.priority === TodoItemPriority.NONE ?
        <CheckIcon style={{color: handlePriorityColor(TodoItemPriority.NONE)}}/> : <div></div>,
      onClick: () => updatePriority(item.id, TodoItemPriority.NONE).then(() => toUpdate && toUpdate(item))
    }]
  });
  if (item.status !== TodoItemStatus.COMPLETE) {
    items.push({
      label: () => <div
        style={{color: 'var(--td-warning-color)'}}>{item.status === TodoItemStatus.ABANDON ? '取消' : ''}放弃</div>,
      icon: () => <ThumbDownIcon style={{color: 'var(--td-warning-color)'}}/>,
      onClick: () => updateStatusToAbandon(item.id).then(() => toUpdate && toUpdate(item))
    });
  } else {
    items.push({
      label: () => <div>重新开始</div>,
      icon: () => <RollbackIcon/>,
      onClick: () => updateStatus(item.id, TodoItemStatus.COMPLETE).then(() => toUpdate && toUpdate(item))
    });
  }

  items.push({
    label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
    icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
    onClick: () => removeById(item.id).then(() => toUpdate && toUpdate(item))
  })


  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items
  })
}