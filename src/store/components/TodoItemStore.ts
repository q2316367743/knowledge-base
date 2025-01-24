import {defineStore} from "pinia";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {map} from "@/utils/lang/ArrayUtil";
import {useCurdStorage} from "@/hooks/CurdStorage";

// 此store只负责展示，不负责增删改
export const useTodoItemStore = defineStore('todo-item', () => {
  // 当前打开的清单ID
  const categoryId = ref(0);
  // 清单列表
  const {
    items: todoItems,
    init: itemInit,
    add: itemAdd,
    updateById: itemUpdate,
    deleteById: itemDelete
  } = useCurdStorage<TodoItemIndex>();

  const {
    items: todoGroups,
    init: groupInit,
    add: groupAdd,
    updateById: groupUpdate,
    deleteById: groupDelete
  } = useCurdStorage<TodoGroup>();

  // 待办
  const todoGroupView = computed<Array<TodoGroupView>>(() => {
    const views = new Array<TodoGroupView>();
    const itemMap = map(todoItems.value, 'id');
    for (const group of todoGroups.value) {
      const view: TodoGroupView = {
        ...group,
        children: []
      }
      group.items.forEach(itemId => {
        const item = itemMap.get(itemId);
        if (item) {
          view.children.push(item);
          itemMap.delete(itemId);
        }
      });
      views.push(view);
    }
    if (itemMap.size > 0) {
      views.push({
        id: 0,
        name: '未分组',
        categoryId: categoryId.value,
        sort: 0,
        children: Array.from(itemMap.values()),
        items: Array.from(itemMap.keys())
      })
    }
    return views;
  })

  async function init(id: number) {
    // 清空
    todoItems.value = [];
    todoGroups.value = [];
    if (id === 0) {
      return;
    }

    try {
      // 获取分组
      await groupInit({key: LocalNameEnum.TODO_GROUP + id})
    } catch (e) {
      console.error("获取待办分组失败", e);
    }

    try {
      // 获取待办项
      await itemInit({key: LocalNameEnum.TODO_CATEGORY + id})
    } catch (e) {
      console.error("获取待办项失败", e);
    }
  }

  const addItem = (item: TodoItemIndex) => itemAdd(item);
  const updateItem = (id: number, item: TodoItemIndex) => itemUpdate(id, item);
  const deleteItem = (id: number) => itemDelete(id);
  const addGroup = (item: TodoGroup) => groupAdd(item);
  const updateGroup = (id: number, item: TodoGroup) => groupUpdate(id, item);
  const deleteGroup = (id: number) => groupDelete(id);

  return {
    categoryId,
    todoGroupView,
    init,
    addItem,
    updateItem,
    deleteItem,
    addGroup,
    updateGroup,
    deleteGroup,
  }

})