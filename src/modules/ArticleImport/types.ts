
export interface ArticleImportItem {
  id: string;
  name: string;
  icon: string;

  /**
   * url匹配规则
   */
  regex: string;
}



export interface ArticleImportGroup {
  id: string;
  name: string;
  items: ArticleImportItem[];
}

export interface ArticleImportRule extends ArticleImportItem {

  /**
   * css选择器
   */
  select: string;

  /**
   * 等待元素出现，render为uBrowser时有效
   */
  wait: string;

  /**
   * 超时时间，单位ms，默认2000ms。超时后，页面不会被终止，并且将被refetch。
   */
  timeout: number;

  /**
   * JSON字符串
   */
  headers: string;

  /**
   * User-Agent
   */
  userAgent: string;
}