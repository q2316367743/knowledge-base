export interface NewsIndex {
  id: string;
  createTime: number;
  icon: string;
  name: string;
}

export interface NewsRule extends NewsIndex {

  /**
   * 目标链接，支持js，支持模板引擎，支持分页
   *
   * 模板引擎：https://text.com/article/{page}@js:`${result}/v1`
   */
  url: string;

  /**
   * 列表规则
   */
  list: string;

  /**
   * 标题规则
   */
  title: string;

  /**
   * 作者规则
   */
  author: string;

  /**
   * 描述规则
   */
  description: string;

  /**
   * 图片规则
   */
  image: string;

  /**
   * 链接规则
   */
  link: string;

  /**
   * 是否使用uBrowser
   */
  webview: boolean;

  /**
   * 等待时间 | 等待元素
   */
  wait: string;

  /**
   * 内容规则
   */
  content: string;

}

export interface NewsInstance {


  /**
   * 标题
   */
  title: string;

  /**
   * 作者
   */
  author: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 图片
   */
  image: string;

  /**
   * 链接
   */
  link: string;

}