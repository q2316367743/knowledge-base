import {TodoItemIndex, TodoItemPriority} from "@/entity/todo/TodoItem";

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

}