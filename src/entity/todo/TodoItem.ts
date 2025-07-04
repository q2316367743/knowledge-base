import {DbRecord} from "@/utils/utools/DbStorageUtil";

/**
 * 待办项
 */
export interface TodoItemIndex {

  id: number;

  /**
   * 创建时间
   */
  createTime: Date | string;

  /**
   * 更新时间
   */
  updateTime: Date | string;

  /**
   * 是否置顶，用于排序
   */
  top: boolean;

  /**
   * 状态，用于分组
   */
  status: TodoItemStatus;

  /**
   * 优先级，用于排序
   */
  priority: TodoItemPriority;

  /**
   * 标题
   */
  title: string;

}

/**
 * 待办项基础树形
 */
export interface TodoItemAttr {

  id: number;

  /**
   * 放弃原因
   */
  reason: string;

  /**
   * 开始时间
   */
  start: string;

  /**
   * 截止至，默认等于开始时间
   */
  end: string;

  /**
   * 完成时间
   */
  completeTime?: Date | string;

  /**
   * 标签
   */
  tags: Array<string>;

}

export interface TodoItemChild {
  id: string;

  /**
   * 是否完成
   */
  complete: boolean;

  /**
   * 优先级，用于排序
   */
  priority: TodoItemPriority;

  /**
   * 标题
   */
  title: string;

}

export interface TodoItemContent {

  id: number

  /**
   * 标签
   *
   * @deprecated todo: 不再使用
   */
  tags: Array<string>;

  /**
   * 内容源码
   */
  content: string;

  /**
   * 子任务
   */
  children?: Array<TodoItemChild>

}

/**
 * 待办项
 */
export interface TodoItem {
  index: TodoItemIndex;
  attr: TodoItemAttr;
  content: DbRecord<TodoItemContent>;
}

export enum TodoItemPriority {

  /**
   * 高
   */
  HIGH = 1,

  /**
   * 中
   */
  MIDDLE = 2,

  /**
   * 低
   */
  FLOOR = 3,

  /**
   * 无，默认
   */
  NONE = 4

}

export const TodoItemPriorityOptions = [
  {
    label: '高优先级',
    value: TodoItemPriority.HIGH
  }, {
    label: '中优先级',
    value: TodoItemPriority.MIDDLE
  }, {
    label: '低优先级',
    value: TodoItemPriority.FLOOR
  }, {
    label: '无优先级',
    value: TodoItemPriority.NONE
  }
]

export enum TodoItemStatus {

  /**
   * 待办
   */
  TODO = 1,

  /**
   * 进行中
   */
  DOING = 4,

  /**
   * 已完成
   */
  COMPLETE = 2,

  /**
   * 放弃
   */
  ABANDON = 3

}

export function todoItemStatusSort(a: TodoItemStatus, b: TodoItemStatus): number {
  let aS: number = a;
  let bS: number = b;
  switch (a) {
    case TodoItemStatus.TODO:
      aS = 1;
      break;
    case TodoItemStatus.DOING:
      aS = 2;
      break;
    case TodoItemStatus.COMPLETE:
      aS = 3;
      break;
    case TodoItemStatus.ABANDON:
      aS = 4;
      break;
  }
  switch (b) {
    case TodoItemStatus.TODO:
      bS = 1;
      break;
    case TodoItemStatus.DOING:
      bS = 2;
      break;
    case TodoItemStatus.COMPLETE:
      bS = 3;
      break;
    case TodoItemStatus.ABANDON:
      bS = 4;
      break;
  }
  return aS - bS;
}

export function getNextTodoItemStatus(status: TodoItemStatus): TodoItemStatus {
  switch (status) {
    case TodoItemStatus.TODO:
      return TodoItemStatus.DOING;
    case TodoItemStatus.DOING:
      return TodoItemStatus.COMPLETE;
    default:
      return TodoItemStatus.TODO;
  }
}

/**
 * 获取默认数据索引
 */
export function getDefaultTodoItemIndex(id?: number): TodoItemIndex {
  return {
    id: id || 0,
    createTime: new Date(),
    updateTime: new Date(),
    top: false,
    status: TodoItemStatus.TODO,
    priority: TodoItemPriority.NONE,
    title: '',
  };
}

/**
 * 获取默认数据内容
 */
export function getDefaultTodoItemContent(id?: number): TodoItemContent {
  return {
    id: id || 0,
    content: '',
    tags: [],
    children: [],
  };
}

export function getDefaultTodoItemAttr(id?: number): TodoItemAttr {
  return {
    id: id || 0,
    reason: '',
    start: '',
    end: '',
    tags: [],
  }
}

export function getDefaultTodoItem(): TodoItem {
  return {
    content: {
      record: getDefaultTodoItemContent(),
      id: ''
    },
    attr: getDefaultTodoItemAttr(),
    index: getDefaultTodoItemIndex()
  }
}

export function handleSimplePriorityColor(priority: TodoItemPriority): string {
  switch (priority) {
    case TodoItemPriority.HIGH:
      return 'red';
    case TodoItemPriority.MIDDLE:
      return 'orange';
    case TodoItemPriority.FLOOR:
      return 'blue';
    default:
      return '#474545';
  }
}

export function handlePriorityColor(priority: TodoItemPriority, status = TodoItemStatus.TODO): string {
  switch (priority) {
    case TodoItemPriority.HIGH:
      if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
        return '#562c27'
      }
      return '#b33327';
    case TodoItemPriority.MIDDLE:
      if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
        return '#6d4f39'
      }
      return '#cc7d41';
    case TodoItemPriority.FLOOR:
      if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
        return '#242d48';
      }
      return '#364fa1';
    default:
      if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
        return 'var(--td-text-color-disabled)'
      }
      return 'var(--td-text-color-primary)';
  }
}


export function handlePriorityText(priority: TodoItemPriority): string {
  switch (priority) {
    case TodoItemPriority.HIGH:
      return '高优先级';
    case TodoItemPriority.MIDDLE:
      return '中优先级';
    case TodoItemPriority.FLOOR:
      return '低优先级';
    case TodoItemPriority.NONE:
      return '无优先级';
    default:
      return '无优先级';
  }

}

export function handleStatusText(status: TodoItemStatus): string {
  switch (status) {
    case TodoItemStatus.TODO:
      return '待办';
    case TodoItemStatus.COMPLETE:
      return '已完成';
    case TodoItemStatus.DOING:
      return '进行中';
    case TodoItemStatus.ABANDON:
      return '已放弃';
    default:
      return '无状态';
  }

}

export function handleTodoTitleColor(item: TodoItemIndex): string {
  if (item.status === TodoItemStatus.COMPLETE || item.status === TodoItemStatus.ABANDON) {
    return 'var(--td-text-color-primary)';
  }
  return handlePriorityColor(item.priority);
}