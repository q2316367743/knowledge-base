import {ListTree} from "@/entity/ListTree";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {TreeOptionData} from "tdesign-vue-next";

/**
 * 待办分类
 */
export interface TodoCategory extends ListTree {

  /**
   * 创建时间
   */
  createTime: Date | string;

  /**
   * 更新时间
   */
  updateTime: Date | string;

  /**
   * 分类类型
   */
  type: TodoCategoryTypeEnum;

  /**
   * 待办排序
   */
  todoListSort: TodoListSortEnum;

  /**
   * 布局类型
   */
  todoListLayout: TodoListLayoutEnum;

  /**
   * 隐藏笔记
   */
  hideOfArticle: boolean;

  /**
   * 隐藏已完成
   */
  hideOfCompleteOrAbandon: boolean;

  showAddGroupBtn: boolean;

  /**
   * 分组类型
   */
  groupType: TodoCategoryGroupEnum

}

export enum TodoCategoryTypeEnum {

  FOLDER = 1,

  TODO = 2

}

export function renderTodoCategoryType(type: TodoCategoryTypeEnum) {
  switch (type) {
    case TodoCategoryTypeEnum.TODO:
      return "待办清单";
    case TodoCategoryTypeEnum.FOLDER:
      return "待办文件夹";
    default:
      return type + '';
  }
}

export enum TodoListLayoutEnum {

  /**
   * 默认布局
   */
  DEFAULT = 1,
  /**
   * 卡片布局
   */
  CARD = 2,
  /**
   * 日历布局
   */
  CALENDAR = 3,

  /**
   * 四象限
   */
  FOUR_QUADRANTS = 4

}

export function renderTodoListLayout(layout: TodoListLayoutEnum): string {
  switch (layout) {
    case TodoListLayoutEnum.CALENDAR:
      return "日历布局";
    case TodoListLayoutEnum.CARD:
      return "卡片布局";
    case TodoListLayoutEnum.FOUR_QUADRANTS:
      return "四象限";
    default:
      return "默认布局";
  }
}

export enum TodoCategoryGroupEnum {
  // 默认分组
  DEFAULT = 1,
  // 优先级分组
  PRIORITY = 2
}

export function getDefaultTodoCategory(source: Partial<TodoCategory>): TodoCategory {
  const now = new Date();
  return Object.assign<TodoCategory, Partial<TodoCategory>>({
    id: now.getTime(),
    createTime: now,
    updateTime: now,
    name: '',
    pid: 0,
    type: TodoCategoryTypeEnum.FOLDER,
    todoListSort: TodoListSortEnum.PRIORITY,
    todoListLayout: TodoListLayoutEnum.DEFAULT,
    hideOfCompleteOrAbandon: false,
    hideOfArticle: false,
    showAddGroupBtn: false,
    groupType: TodoCategoryGroupEnum.DEFAULT
  }, source);
}

export type TodoCategoryRecord = Omit<TodoCategory, 'id' | 'createTime' | 'updateTime'>;

export function listToTree(list: Array<TodoCategory>): Array<TreeOptionData> {
  const base: Array<TreeOptionData> = list.filter(c => c.pid === 0 || !c.pid)
    .map(c => ({
      value: c.id,
      label: c.name,
      children: [],
      leaf: c.type === TodoCategoryTypeEnum.TODO
    }));
  base.forEach(item => _listToTree(item, item.value as number, list));
  return base;
}

function _listToTree(tree: TreeOptionData, pid: number, categories: Array<TodoCategory>) {
  tree.children = categories.filter(c => c.pid === pid)
    .map(c => ({
      value: c.id,
      label: c.name,
      children: [],
      leaf: c.type === TodoCategoryTypeEnum.TODO,
    } as TreeOptionData));
  tree.children.forEach(item => _listToTree(item, item.value as number, categories));
}
