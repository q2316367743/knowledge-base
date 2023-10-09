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

export interface TodoItemContent {

    id: number

    /**
     * 内容源码
     */
    content: string;

    /**
     * 内容预览
     */
    preview: string;

    /**
     * 标签
     */
    tags: Array<string>;

    /**
     * 截止至，仅用于展示
     */
    end: string;

    /**
     * 进度
     */
    progress: number;

}

/**
 * 待办项
 */
export interface TodoItem {
    index: TodoItemIndex;
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
    COMPLETE

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
        preview: '',
        tags: [],
        end: '',
        progress: 0
    };
}

export function getDefaultTodoItem(): TodoItem {
    return {
        content: {
            record: getDefaultTodoItemContent()
        },
        index: getDefaultTodoItemIndex()
    }
}
