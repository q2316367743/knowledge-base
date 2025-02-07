import {defineStore} from "pinia";
import {
  TodoItemAttr,
  TodoItemIndex,
  TodoItemPriority,
  TodoItemPriorityOptions,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {group, map, toSorted} from "@/utils/lang/ArrayUtil";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";

function renderGroupView(todoGroup: TodoGroup, itemMap: Map<number, TodoItemIndex>): TodoGroupView {
  const view: TodoGroupView = {
    ...todoGroup,
    children: [],
    complete: []
  }
  const filter = todoGroup.items
    .map(itemId => {
      let target = itemMap.get(itemId);
      itemMap.delete(itemId);
      return target;
    })
    .filter(target => {
      // 已完成、已放弃
      if (target) {
        if (target.status === TodoItemStatus.COMPLETE || target.status === TodoItemStatus.ABANDON) {
          view.complete.push(target);
          return false;
        }
        return true;
      }
      return false;
    }) as Array<TodoItemIndex>;
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
  // 分组排序
  const todoGroups1 = toSorted(todoGroups, (a, b) => a.sort - b.sort);
  for (const todoGroup of todoGroups1) {
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

  async function addItem(record: Partial<TodoItemIndex>, attr: Partial<TodoItemAttr>, group?: TodoGroup) {
    // 添加到待办
    const target = await useTodoItemStore().addSimple(categoryId.value, record, attr);
    // 添加到分组
    if (group) {
      await useTodoGroupStore().pushTo(group, target.id)
    }
  }

  return {
    categoryId,
    todoGroupView,
    init,
    postGroup, deleteGroup,
    addItem
  }

})