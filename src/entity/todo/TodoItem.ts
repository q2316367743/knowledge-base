/**
 * 待办项
 */
export interface TodoItem {

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
     * 是否置顶
     */
    top: boolean;

    /**
     * 状态
     */
    status: TodoItemStatus;

    /**
     * 优先级
     */
    priority: TodoItemPriority;

    /**
     * 标题
     */
    title: string;

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
     * 进行中
     */
    DOING = 2,

    /**
     * 已完成
     */
    COMPLETE

}

/**
 * 获取默认数据
 */
export function getDefaultTodoItem(): TodoItem {
    return {
        id: 0,
        createTime: new Date(),
        updateTime: new Date(),
        top: false,
        status: TodoItemStatus.TODO,
        priority: TodoItemPriority.NONE,
        title: '',
        content: '',
        preview: '',
        tags: [],
        end: '',
        progress: 0
    };
}
