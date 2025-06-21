import {ArticleIndex} from "@/entity/article";
import {urlJoin} from "@/utils/file/FileUtil";
import {buildArticleIcon} from "@/pages/note/components/he-context";
import {FolderIcon} from "tdesign-icons-vue-next";
import {group, MapWrap} from "@/utils/lang/ArrayUtil";
import {KbTreeNodeData} from "@/components/KbTree/types";

/**
 * 基础列表树
 */
export interface ListTree {

  id: number;

  pid: number;

  name: string;

}

type TreeNode = ListTree & { fontColor?: string };

/**
 * 将列表转为树
 * @param list 列表
 * @param topName 顶部名称
 */
export function listToTree(list: Array<TreeNode>, topName: string): Array<KbTreeNodeData> {
  const folderGroupMap = group(list, 'pid');
  // 先找0
  const base: Array<KbTreeNodeData> = folderGroupMap.getOrDefault(0, [])
    .map(c => ({
      value: c.id,
      label: c.name,
      text: c.name,
      children: [],
      fontColor: c?.fontColor
    }));
  // 删除这个
  folderGroupMap.delete(0)
  base.forEach(item => _listToTree(item, item.value as number, folderGroupMap));
  // 如果还有，则加入到根节点
  if (folderGroupMap.size > 0) {
    folderGroupMap.forEach(item => {
      item.forEach(c => base.push({
        value: c.id,
        label: c.name,
        text: c.name,
        children: [],
        fontColor: c?.fontColor
      }))
    })
  }
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
export function listToTreeSpecial(list: Array<ListTree>, pid = 0): Array<KbTreeNodeData> {
  const folderGroupMap = group(list, 'pid');
  const base: Array<KbTreeNodeData> = folderGroupMap.getOrDefault(pid, [])
    .map(c => ({
      value: c.id,
      label: c.name,
      children: []
    }));
  base.forEach(item => _listToTree(item, item.value as number, folderGroupMap));
  return base;
}

function _listToTree(tree: KbTreeNodeData, pid: number, folderGroupMap: MapWrap<number, Array<TreeNode>>) {
  tree.children = folderGroupMap.getOrDefault(pid, [])
    .map(c => ({
      value: c.id,
      label: c.name,
      text: c.name,
      children: [],
      fontColor: c?.fontColor
    } as KbTreeNodeData));
  folderGroupMap.delete(pid)
  tree.children.forEach(item => _listToTree(item, item.value as number, folderGroupMap));
}


/**
 * 遍历整个树，将笔记挂载
 * @param list 树节点
 * @param treeData 树节点
 * @param articleListMap 笔记列表
 * @param map 映射函数
 */
export function treeEach(
  list: Array<KbTreeNodeData>,
  treeData: Array<KbTreeNodeData>,
  articleListMap: Map<number | null, Array<ArticleIndex>>,
  map?: (data: KbTreeNodeData) => KbTreeNodeData
) {
  list.forEach(item => {
    let temp: KbTreeNodeData = {
      value: item.value,
      label: item.label,
      children: [],
      icon: FolderIcon,
      pid: item.pid,
      preview: item.preview,
      color: item.fontColor
    }

    if (map) {
      temp = map(temp);
    }

    treeData.push(temp);

    // 分类
    treeEach((item.children) || [], (temp.children) || [], articleListMap, map);
    // 笔记
    const articles = articleListMap.get(item.value as number);
    if (articles) {
      articles.map(article => ({
        value: article.id,
        label: article.name,
        leaf: true,
        icon: buildArticleIcon(article.type, article.preview),
        pid: article.folder,
        preview: article.preview,
        color: article.fontColor
      } as KbTreeNodeData)).forEach(article => {

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
      // 排序
      temp.children = (temp.children as  Array<KbTreeNodeData>).sort((a, b) => {
        if (a.leaf  === b.leaf) {
          return (a.label as string).localeCompare(b.label as string)
        }
        return (a.leaf ? 1 : 0) - (b.leaf ? 1 : 0)
      });
    }
  });
}

/**
 * 树搜索
 * @param keyword 关键字
 * @param tree 树
 */
export function searchData(keyword: string, tree: Array<KbTreeNodeData>): Array<KbTreeNodeData> {
  if (!keyword || keyword.length === 0) {
    return tree;
  }
  const loop = (data: Array<KbTreeNodeData>): Array<KbTreeNodeData> => {
    const result = new Array<KbTreeNodeData>();
    data.forEach(item => {
      if (item.label && item.label.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
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
      map.set(urlJoin(path, article.name), article.id);
    }
  }

  // 此目录下可能存在的其他目录
  let items = list.filter(i => i.pid === pid);
  for (let item of items) {
    // 此目录下的目录
    _listToMap(list, map, articleListMap, urlJoin(path, item.name), item.id);
  }
}
