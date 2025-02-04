import {defineStore} from "pinia";
import {TodoItemIndex, TodoItemPriority, TodoItemPriorityOptions} from "@/entity/todo/TodoItem";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {group, map} from "@/utils/lang/ArrayUtil";
import {useCurdStorage} from "@/hooks/CurdStorage";
import {isEmptyString} from "@/utils/lang/StringUtil";
import {useSnowflake} from "@/hooks/Snowflake";

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
    if (items) {
      view.children.push({
        label: option.label,
        value: option.value,
        children: items
      })
    }
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
  } = useCurdStorage<TodoItemIndex, number>();

  const {
    items: todoGroups,
    init: groupInit,
    add: groupAdd,
    updateById: groupUpdate,
    deleteById: groupDelete
  } = useCurdStorage<TodoGroup, string>();

  // 待办
  const todoGroupView = computed<Array<TodoGroupView>>(() => {
    const views = new Array<TodoGroupView>();


    const itemMap = map(todoItems.value, 'id');
    for (const todoGroup of todoGroups.value) {
      views.push(renderGroupView(todoGroup, itemMap));
    }
    if (itemMap.size > 0) {
      const empty: TodoGroup = {
        id: '0',
        name: '未分组',
        categoryId: categoryId.value,
        sort: 0,
        items: Array.from(itemMap.keys())
      };
      views.push(renderGroupView(empty, itemMap))
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
  const postGroup = async (id: string, name: string, items: Array<number>) => {
    // 获取全部的分组
    if (isEmptyString(name)) return Promise.reject(new Error("分组名称不存在"));
    if (todoGroups.value.map(e => e.name).includes(name)) return Promise.reject(new Error("分组名称重复"));
    if (id !== '0') {
      // 修改
      const idx = todoGroups.value.findIndex(e => e.id === id);
      if (idx === -1) {
        id = '0';
      } else {
        await groupUpdate(id, {name});
      }
    }
    if (id === '0') {
      // 新增
      await groupAdd({
        id: useSnowflake().nextId(),
        name,
        categoryId: categoryId.value,
        sort: todoGroups.value.length + 1,
        items
      })
    }

  };
  const deleteGroup = (id: string) => groupDelete(id);

  return {
    categoryId,
    todoGroupView,
    init,
    addItem,
    updateItem,
    deleteItem,
    postGroup,
    deleteGroup,
  }

})