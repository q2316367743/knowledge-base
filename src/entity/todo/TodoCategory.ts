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

}

export enum TodoCategoryTypeEnum {

    FOLDER = 1,

    TODO = 2

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
        hideOfAbandon: false,
        hideOfComplete: false,
        hideOfArticle: false,
        todoListSort: TodoListSortEnum.PRIORITY
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
