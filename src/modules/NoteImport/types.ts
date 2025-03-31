export interface NoteImportItem {
  id: string;
  name: string;

  /**
   * url匹配规则
   */
  regex: RegExp;
}

export interface NoteImportRule extends NoteImportItem {

  /**
   * 标题选择起
   */
  title?: string;

  /**
   * 内容选择器
   */
  body: string;

  /**
   * 等待元素出现，
   */
  wait?: string;

  /**
   * 超时时间，单位ms，默认2000ms。超时后，页面不会被终止，并且将被refetch。
   */
  timeout?: number;

  /**
   * JSON字符串
   */
  headers?: string;

  /**
   * User-Agent
   */
  userAgent?: string;
}

export interface NoteImportGroup {
  id: string;
  name: string;
  items: NoteImportRule[];
}
