import {TodoItemIndex, TodoItemPriority, TodoItemPriorityOptions, TodoItemStatus} from "@/entity/todo/TodoItem";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {TodoGroup, TodoGroupView} from "@/entity/todo/TodoGroup";
import {group, map, toSorted} from "@/utils/lang/ArrayUtil";

export function sortTodoIndex(a: TodoItemIndex, b: TodoItemIndex, sort: TodoListSortEnum): number {
  if (a.top) {
    return -1;
  }
  if (b.top) {
    return 1;
  }
  if (sort === TodoListSortEnum.PRIORITY) {
    return a.priority - b.priority || a.id - b.id;
  } else if (sort === TodoListSortEnum.NAME_ASC) {
    return a.title.localeCompare(b.title, 'zh-CH') || a.id - b.id;
  } else if (sort === TodoListSortEnum.NAME_DESC) {
    return b.title.localeCompare(a.title, 'zh-CH') || a.id - b.id;
  } else if (sort === TodoListSortEnum.CREATE_TIME_ASC) {
    return a.id - b.id;
  } else if (sort === TodoListSortEnum.CREATE_TIME_DESC) {
    return b.id - a.id;
  }
  return a.priority - b.priority || a.id - b.id;
}

function renderGroupView(todoGroup: TodoGroup, itemMap: Map<number, TodoItemIndex>, sort: TodoListSortEnum): TodoGroupView {
  const view: TodoGroupView = {
    ...todoGroup,
    children: [],
    complete: [],
    top: []
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
      children: toSorted((items || []).filter(e => {
        if (e.top) {
          view.top.push(e);
          return false;
        }
        return true;
      }), (a, b) => sortTodoIndex(a, b, sort))
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

export function renderGroupViews(todoItems: Array<TodoItemIndex>, todoGroups: Array<TodoGroup>, categoryId: number, sort: TodoListSortEnum) {
  const views = new Array<TodoGroupView>();
  const itemMap = map(todoItems, 'id');
  // 分组排序
  const todoGroups1 = toSorted(todoGroups, (a, b) => a.sort - b.sort);
  for (const todoGroup of todoGroups1) {
    views.push(renderGroupView(todoGroup, itemMap, sort));
  }
  if (itemMap.size > 0) {
    const empty: TodoGroup = {
      id: '-1',
      name: '未分组',
      categoryId: categoryId,
      sort: -1,
      items: Array.from(itemMap.keys())
    };
    const emptyView = renderGroupView(empty, itemMap, sort);
    const todoCount = emptyView.children.map(e => e.children.length).reduce((a, b) => a + b, 0);
    const completeCount = emptyView.complete.length;
    if (todoCount + completeCount > 0) {
      views.push(emptyView);
    }
  }
  return views;
}