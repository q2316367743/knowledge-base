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
    ABANDON = 3,

    /**
     * 进行中
     */
    DOING = 4

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
        start: '',
        end: ''
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
            return 'purple';
    }
}

export function handlePriorityColor(priority: TodoItemPriority): string {
    switch (priority) {
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
