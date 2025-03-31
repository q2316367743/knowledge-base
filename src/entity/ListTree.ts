import {IconFolder} from "@arco-design/web-vue/es/icon";
import {ArticleIndex} from "@/entity/article";
import {pathJoin} from "@/utils/file/FileUtil";
import {buildArticleIcon} from "@/pages/note/components/he-context";
import {TreeOptionData} from "tdesign-vue-next/es/common";

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
export function listToTree(list: Array<ListTree & { fontColor?: string }>, topName: string): Array<TreeOptionData> {
  const base: Array<TreeOptionData> = list.filter(c => c.pid === 0 || !c.pid)
    .map(c => ({
      value: c.id,
      label: c.name,
      text: c.name,
      children: [],
      fontColor: c?.fontColor
    }));
  base.forEach(item => _listToTree(item, item.value as number, list));
  return [{
    value: 0,
    label: topName,
    text: topName,
    children: base
  }];
}

/**
 * 将列表转为树
 * @param list 列表
 * @param pid 基础目录ID
 */
export function listToTreeSpecial(list: Array<ListTree>, pid = 0): Array<TreeOptionData> {
  const base: Array<TreeOptionData> = list.filter(c => c.pid === pid)
    .map(c => ({
      value: c.id,
      label: c.name,
      children: []
    }));
  base.forEach(item => _listToTree(item, item.value as number, list));
  return base;
}

function _listToTree(tree: TreeOptionData, pid: number, categories: Array<ListTree>) {
  tree.children = categories.filter(c => c.pid === pid)
    .map(c => ({
      value: c.id,
      label: c.name,
      text: c.name,
      children: []
    } as TreeOptionData));
  tree.children.forEach(item => _listToTree(item, item.value as number, categories));
}


/**
 * 遍历整个树，将笔记挂载
 * @param list 树节点
 * @param treeData 树节点
 * @param articleListMap 笔记列表
 * @param map 映射函数
 */
export function treeEach(
  list: Array<TreeOptionData>,
  treeData: Array<TreeOptionData>,
  articleListMap: Map<number | null, Array<ArticleIndex>>,
  map?: (data: TreeOptionData) => TreeOptionData
) {
  list.forEach(item => {
    let temp: TreeOptionData = {
      value: item.value,
      label: item.label,
      children: [],
      icon: () => h(IconFolder, {}),
      pid: item.pid,
      preview: item.preview,
      color: item.fontColor
    }

    if (map) {
      temp = map(temp);
    }

    treeData.push(temp);

    // 分类
    treeEach((item.children as Array<TreeOptionData>) || [], (temp.children as Array<TreeOptionData>) || [], articleListMap, map);
    // 笔记
    const articles = articleListMap.get(item.value as number);
    if (articles) {
      articles.map(article => ({
        value: article.id,
        label: article.name,
        leaf: true,
        icon: () => buildArticleIcon(article.type, article.preview),
        pid: article.folder,
        preview: article.preview,
        color: article.fontColor
      } as TreeOptionData)).forEach(article => {

        if (map) {
          article = map(article);
        }


        if (!temp.children) {
          temp.children = [];
        }
        if (!Array.isArray(temp.children)) {
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
export function searchData(keyword: string, tree: Array<TreeOptionData>): Array<TreeOptionData> {
  if (!keyword || keyword.length === 0) {
    return tree;
  }
  const loop = (data: Array<TreeOptionData>): Array<TreeOptionData> => {
    const result = new Array<TreeOptionData>();
    data.forEach(item => {
      if (item.label && typeof item.label === 'string' && item.label.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({...item});
      } else if (Array.isArray(item.children)) {
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


  // 此目录下可能存在的笔记
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
