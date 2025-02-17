import {TreeNodeData} from "@arco-design/web-vue";
import {h} from "vue";
import {IconFolder} from "@arco-design/web-vue/es/icon";
import {ArticleIndex} from "@/entity/article";
import {pathJoin} from "@/utils/file/FileUtil";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import {buildArticleIcon} from "@/pages/note/components/he-context";

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

/**
 * 将列表转为树
 * @param list 列表
 * @param pid 基础目录ID
 */
export function listToTreeSpecial(list: Array<ListTree>, pid = 0): Array<TreeNodeData> {
    const base: Array<TreeNodeData> = list.filter(c => c.pid === pid)
        .map(c => ({
            key: c.id,
            title: c.name,
            children: []
        }));
    base.forEach(item => _listToTree(item, item.key as number, list));
    return base;
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
    list: Array<TreeNodeData>,
    treeData: Array<TreeNodeData>,
    articleListMap: Map<number | null, Array<ArticleIndex>>,
    map?: (data: TreeNodeData) => TreeNodeData
) {
    list.forEach(item => {
        let temp: TreeNodeData = {
            key: item.key,
            title: item.title,
            children: [],
            icon: () => h(IconFolder, {}),
        }

        if (map) {
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
                icon: () => buildArticleIcon(article.type, article.preview)
            } as TreeNodeData)).forEach(article => {

                if (map) {
                    article = map(article);
                }


                if (!temp.children) {
                    temp.children = [];
                }
                temp.children.push(article)
            });
        }
    });
}

/**
 * 树搜索
 * @param keyword 关键字
 * @param tree 树
 */
export function searchData(keyword: string, tree: Array<TreeNodeData>): Array<TreeNodeData> {
    if (!keyword || keyword.length === 0) {
        return tree;
    }
    const loop = (data: Array<TreeNodeData>): Array<TreeNodeData> => {
        const result = new Array<TreeNodeData>();
        data.forEach(item => {
            if (item.title && item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                result.push({...item});
            } else if (item.children) {
                const filterData = loop(item.children);
                if (filterData.length) {
                    result.push({
                        ...item,
                        children: filterData
                    })
                }
            }
        })
        return result;
    }

    return loop(tree);
}

export function listToList(list: Array<ListTree>, articleListMap: Map<number, Array<ArticleIndex>>, pid: number = 0): Map<string, number> {
    const map = new Map<string, number>();
    _listToMap(list, map, articleListMap, '', pid);
    return map;
}

function _listToMap(
    list: Array<ListTree>,
    map: Map<string, number>,
    articleListMap: Map<number, Array<ArticleIndex>>,
    path: string,
    pid: number) {


    // 此目录下可能存在的文章
    const articles = articleListMap.get(pid);
    if (articles) {
        for (let article of articles) {
            map.set(pathJoin(path, article.name), article.id);
        }
    }

    // 此目录下可能存在的其他目录
    let items = list.filter(i => i.pid === pid);
    for (let item of items) {
        // 此目录下的目录
        _listToMap(list, map, articleListMap, pathJoin(path, item.name), item.id);
    }
}

/**
 * 树排序
 *
 * @param treeNodes 树节点
 * @param sortType 排序类型
 */
export function treeSort(treeNodes: Array<TreeNodeData>, sortType: ArticleSortEnum) {
    treeNodes.sort((a, b) => {
        if (sortType === ArticleSortEnum.CREATE_TiME_DESC) {
            return (b.key as number) - (a.key as number);
        } else if (sortType === ArticleSortEnum.NAME_ASC) {
            return (a.title as string).localeCompare(b.title as string);
        } else if (sortType === ArticleSortEnum.NAME_DESC) {
            return (b.title as string).localeCompare(a.title as string);
        } else {
            return (a.key as number) - (b.key as number);
        }
    })
}
