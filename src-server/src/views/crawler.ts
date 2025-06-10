export interface CrawlerProps {

  /**
   * 等待元素出现，
   */
  wait?: string | number;

  /**
   * 超时时间，单位ms，默认5000ms。超时后，页面不会被终止，并且将被refetch。
   */
  timeout?: number;

  /**
   * JSON字符串
   */
  headers?: Record<string, string>;

  /**
   * User-Agent
   */
  userAgent?: string;
}

export interface CrawlerMarkdownProps extends CrawlerProps {
  /**
   * 标题选择器
   */
  title?: string;

  /**
   * 内容选择器
   */
  body: string;

}

export interface CrawlerMarkdownBody {
  url: string;
  props?: CrawlerMarkdownProps;
}

export interface CrawlerResult {
  html: string;
}

export interface CrawlerMarkdownResult extends CrawlerResult {
  title: string;
  markdown: string;
}
