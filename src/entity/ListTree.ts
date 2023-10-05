import {TreeNodeData} from "@arco-design/web-vue";
import {h} from "vue";
import {IconFile, IconFolder} from "@arco-design/web-vue/es/icon";
import {ArticleIndex} from "@/entity/article";

/**
 * 基础列表树
 */
export interface ListTree {

    id: number;

    pid: number;

    name: string;

}


/**
 * 将列表转为树
 * @param list 列表
 * @param topName 顶部名称
 */
export function listToTree(list: Array<ListTree>, topName: string): Array<TreeNodeData> {
    const base: Array<TreeNodeData> = list.filter(c => c.pid === 0 || !c.pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: []
        }));
    base.forEach(item => _listToTree(item, item.key as number, list));
    return [{
        key: 0,
        title: topName,
        children: base
    }];
}

function _listToTree(tree: TreeNodeData, pid: number, categories: Array<ListTree>) {
    tree.children = categories.filter(c => c.pid === pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: []
        } as TreeNodeData));
    tree.children.forEach(item => _listToTree(item, item.key as number, categories));
}


/**
 * 遍历整个树，将文章挂载
 * @param list 树节点
 * @param treeData 树节点
 * @param articleListMap 文章列表
 * @param map 映射函数
 */
export function treeEach(
    list: Array<TreeNodeData>, treeData: Array<TreeNodeData>,
    articleListMap: Map<number | null, Array<ArticleIndex>>,
    map?: (data: TreeNodeData) => TreeNodeData
) {
    list.forEach(item => {
        let temp: TreeNodeData = {
            key: item.key,
            title: item.title,
            children: [],
            icon: () => h(IconFolder, {})
        }

        if (map){
            temp = map(temp);
        }

        treeData.push(temp);

        // 分类
        treeEach(item.children || [], temp.children || [], articleListMap, map);
        // 文章
        const articles = articleListMap.get(item.key as number);
        if (articles) {
            articles.map(article => ({
                key: article.id,
                title: article.name,
                isLeaf: true,
                icon: () => h(IconFile, {}),
            })).forEach(article => {
                if (!temp.children) {
                    temp.children = [];
                }
                temp.children.push(article)
            });
        }
    });
}
