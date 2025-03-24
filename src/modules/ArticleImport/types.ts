export interface ArticleImportItem {
  id: string;
  name: string;
  icon: string;
}

export interface ArticleImportGroup {
  id: string;
  name: string;
  items: ArticleImportItem[];
}

export interface ArticleImportRule extends ArticleImportItem {
  type: 1|2;
  wait: string;
  method: 'GET'|'POST',
  params: Record<string, any>;
  data: Record<string, any>;
  // 响应体节点
  body: string;
}