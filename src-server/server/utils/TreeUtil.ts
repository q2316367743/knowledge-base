import type { ArticleIndex } from "@/views/ArticleIndex";

/**
 * 基础列表树
 */
export interface ListTree {

  id: number;

  pid: number;

  name: string;

}

export function urlJoin(...paths: string[]): string {
  return paths.join('/');
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