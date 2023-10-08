import {ListTree} from "@/entity/ListTree";
import {TreeNodeData} from "@arco-design/web-vue";
import {h} from "vue";
import {IconFolder, IconList} from "@arco-design/web-vue/es/icon";

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
     */
    type: TodoCategoryTypeEnum;

}

export enum TodoCategoryTypeEnum {

    FOLDER = 1,

    TODO = 2

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
