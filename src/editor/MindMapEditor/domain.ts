import {SearchContentOption} from "@/pages/note/components/SearchContent";

export interface MindMapNode {
  // 是否是根节点
  isRoot: boolean;
  // 是否是概要
  isGeneralization: boolean;

  // 设置图片
  setImage(data: {
    url: string;
    title: string;
    width: number;
    height: number;
  }): void;

  getData(type: string): any;

  setHyperlink(url: string, title: string): void;

  setNote(note: string): void;

  setText(text: string, richText: boolean, resetRichText: boolean): void;

  setTag(tags: Array<string>): void;

  setIcon(icons: Array<string>): void;

  nodeData: MindMapTreeNode;
}

export interface MindMapNodeData {
  uid: string;
  text: string;
  richText: boolean;
  expand: boolean;
  isActive: boolean;
  icon?: Array<string>;
  tag?: Array<string>;
  hyperlink?: string;
  hyperlinkTitle?: string;
}

export interface MindMapTreeNode {
  data: MindMapNodeData;
  children: Array<MindMapTreeNode>;
}

export interface MindMapTreeData {
  layout: "logicalStructure",
  root: MindMapTreeNode;
  theme: {
    template: "default",
    config: Record<string, any>
  },
  view: Record<string, any>
}


function _findKeyword(
  keyword: string,
  data: MindMapTreeNode,
  items: Array<string>
) {
  const content = data.data.text;
  const index = content.indexOf(keyword);
  if (index > -1) {
    const length = content.length;
    const prefix = content.substring(0, index);
    const key = content.substring(
      index,
      Math.min(length, index + keyword.length)
    );
    const suffix = content.substring(
      Math.min(length, index + keyword.length),
      length
    );
    items.push(`${prefix}<mark class="keyword">${key}</mark>${suffix}`);
  }
  if (data.children) {
    data.children.forEach((child) => _findKeyword(keyword, child, items));
  }
}

/**
 * 在思维导图中查找关键字
 * @param keyword 关键字
 * @param data 思维导图
 * @param options 选项
 *
 * @return 包含思维导图的数组
 */
export function findKeyword(
  keyword: string,
  data: MindMapTreeNode,
  options?: SearchContentOption
): Array<string> {
  const items = new Array<string>();
  _findKeyword(keyword, data, items);
  return items;
}
