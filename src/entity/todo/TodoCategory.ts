import {ListTree} from "@/entity/ListTree";
import {TreeNodeData} from "@arco-design/web-vue";
import {h} from "vue";
import {IconFolder, IconList} from "@arco-design/web-vue/es/icon";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";

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
     * 隐藏待办
     */
    hideOfTodo: boolean;

    /**
     * 隐藏进行中
     */
    hideOfDoing: boolean;

    /**
     * 隐藏已完成
     */
    hideOfComplete: boolean;

    /**
     * 隐藏已放弃
     */
    hideOfAbandon: boolean;

    /**
     * 隐藏文章
     */
    hideOfArticle: boolean;

    /**
     * 待办排序
     */
    todoListSort: TodoListSortEnum;

    /**
     * 布局类型
     */
    todoListLayout: TodoListLayoutEnum;

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
    CALENDAR = 3

}

export function renderTodoListLayout(layout: TodoListLayoutEnum): string {
    switch (layout){
        case TodoListLayoutEnum.CALENDAR:
            return "日历布局";
        case TodoListLayoutEnum.CARD:
            return "卡片布局";
        default:
            return "默认布局";
    }
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
        hideOfTodo: false,
        hideOfAbandon: false,
        hideOfComplete: false,
        hideOfDoing: false,
        hideOfArticle: false,
        todoListSort: TodoListSortEnum.PRIORITY,
        todoListLayout: TodoListLayoutEnum.DEFAULT
    }, source);
}

export type TodoCategoryRecord = Omit<TodoCategory, 'id' | 'createTime' | 'updateTime'>;

export function listToTree(list: Array<TodoCategory>): Array<TreeNodeData> {
    const base: Array<TreeNodeData> = list.filter(c => c.pid === 0 || !c.pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: [],
            isLeaf: c.type === TodoCategoryTypeEnum.TODO,
            icon: () => c.type === TodoCategoryTypeEnum.TODO ? h(IconList, {}) : h(IconFolder, {})
        }));
    base.forEach(item => _listToTree(item, item.key as number, list));
    return base;
}

function _listToTree(tree: TreeNodeData, pid: number, categories: Array<TodoCategory>) {
    tree.children = categories.filter(c => c.pid === pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: [],
            isLeaf: c.type === TodoCategoryTypeEnum.TODO,
            icon: () => c.type === TodoCategoryTypeEnum.TODO ? h(IconList, {}) : h(IconFolder, {})
        } as TreeNodeData));
    tree.children.forEach(item => _listToTree(item, item.key as number, categories));
}
