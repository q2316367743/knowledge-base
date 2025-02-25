import {TodoItemIndex, TodoItemPriority} from "@/entity/todo/TodoItem";
import {group} from "@/utils/lang/ArrayUtil";

/**
 * 待办分组
 */
export interface TodoGroup {

  id: string;

  /**
   * 所属待办分组
   */
  categoryId: number;

  /**
   * 分类名称
   */
  name: string;

  /**
   * 排序，正序
   */
  sort: number;

  /**
   * 待办项
   */
  items: Array<number>;

}

export interface TodoGroupPriorityView {
  value: TodoItemPriority;
  label: string;
  children: Array<TodoItemIndex>;
}

/**
 * 分组视图
 */
export interface TodoGroupView extends TodoGroup {

  children: Array<TodoGroupPriorityView>;

  // 已完成 & 已放弃
  complete: Array<TodoItemIndex>;

}

export interface TodoPriorityView {
  value: TodoItemPriority;
  label: string;
  children: Array<TodoItemIndex>;
  // 已完成 & 已放弃
  complete: Array<TodoItemIndex>;
}

export function todoGroupToPriorityView(todoGroupViews: Array<TodoGroupView>): Array<TodoPriorityView> {
  const list = todoGroupViews.flatMap(e => e.children);
  const completes = todoGroupViews.flatMap(e => e.complete);
  const completeMap = group(completes, 'priority');
  const res = new Array<TodoPriorityView>();
  group(list, "value").forEach((v, k) => {
    res.push({
      value: k,
      label: v[0].label,
      children: v.flatMap(e => e.children),
      complete: completeMap.getOrDefault(k, [])
    })
  });
  return res;
}