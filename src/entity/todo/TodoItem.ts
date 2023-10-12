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
     * 截止至，仅用于展示
     */
    end: string;

    /**
     * 进度
     */
    progress: number;

}

export interface TodoItemContent {

    id: number

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 内容源码
     */
    content: string;

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

export enum TodoItemStatus {

    /**
     * 待办
     */
    TODO = 1,

    /**
     * 已完成
     */
    COMPLETE = 2,

    /**
     * 放弃
     */
    ABANDON = 3

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
    };
}

export function getDefaultTodoItemAttr(id?: number): TodoItemAttr {
    return {
        id: id || 0,
        reason: '',
        end: '',
        progress: 0
    }
}

export function getDefaultTodoItem(): TodoItem {
    return {
        content: {
            record: getDefaultTodoItemContent()
        },
        index: getDefaultTodoItemIndex()
    }
}

export function handlePriorityColor(priority: TodoItemPriority): string {
    switch (priority){
        case TodoItemPriority.HIGH:
            return 'rgb(var(--red-6))';
        case TodoItemPriority.MIDDLE:
            return 'rgb(var(--orange-6))';
        case TodoItemPriority.FLOOR:
            return 'rgb(var(--arcoblue-6))';
        case TodoItemPriority.NONE:
            return 'var(--color-text-1)';
        default:
            return 'var(--color-text-1)';
    }
}
