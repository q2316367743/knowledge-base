import {defineStore} from "pinia";
import {TodoItemIndex, TodoItemPriority, TodoItemPriorityOptions} from "@/entity/todo/TodoItem";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {group, map} from "@/utils/lang/ArrayUtil";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";

function renderGroupView(todoGroup: TodoGroup, itemMap: Map<number, TodoItemIndex>): TodoGroupView {
  const view: TodoGroupView = {
    ...todoGroup,
    children: []
  }
  let filter = todoGroup.items.map(itemId => {
    let target = itemMap.get(itemId);
    itemMap.delete(itemId);
    return target;
  }).filter(e => !!e);
  const priorityMap = group(filter, 'priority');
  for (let option of TodoItemPriorityOptions) {
    const items = priorityMap.get(option.value);
    priorityMap.delete(option.value);
    view.children.push({
      label: option.label,
      value: option.value,
      children: items || []
    });
  }
  if (priorityMap.size > 0) {
    view.children.push({
      label: '无优先级',
      value: TodoItemPriority.NONE,
      children: Array.from(priorityMap.values()).flatMap(e => e)
    })
  }
  return view;
}

function renderGroupViews(todoItems: Array<TodoItemIndex>, todoGroups: Array<TodoGroup>, categoryId: number) {
  const views = new Array<TodoGroupView>();
  const itemMap = map(todoItems, 'id');
  for (const todoGroup of todoGroups) {
    views.push(renderGroupView(todoGroup, itemMap));
  }
  if (itemMap.size > 0) {
    const empty: TodoGroup = {
      id: '-1',
      name: '未分组',
      categoryId: categoryId,
      sort: -1,
      items: Array.from(itemMap.keys())
    };
    views.push(renderGroupView(empty, itemMap))
  }
  return views;
}

// 此store只负责展示，不负责增删改
export const useTodoWrapStore = defineStore('todo-item', () => {
  // 当前打开的清单ID
  const categoryId = ref(0);
  // 清单列表

  // 待办
  const todoGroupView = computed<Array<TodoGroupView>>(
    () => {
      if (categoryId.value === 0) {
        return [];
      }
      return renderGroupViews(useTodoItemStore().items, useTodoGroupStore().items, categoryId.value)
    });

  async function init(id: number) {
    // 清空
    categoryId.value = id;
    if (id === 0) {
      return;
    }

    try {
      // 获取分组
      await useTodoGroupStore().init(id);
    } catch (e) {
      console.error("获取待办分组失败", e);
    }

    try {
      // 获取待办项
      await useTodoItemStore().init(id)
    } catch (e) {
      console.error("获取待办项失败", e);
    }

  }

  const postGroup = async (id: string, name: string, items: Array<number>) => {
    // 处理分组
    return useTodoGroupStore().saveOrUpdate(id, name, items, categoryId.value);
  };
  const deleteGroup = async (id: string, targetGroupId: string) => {
    await useTodoGroupStore().deleteById(id, targetGroupId);
  };

  return {
    categoryId,
    todoGroupView,
    init,
    postGroup,
    deleteGroup,
  }

})