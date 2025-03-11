import {useSnowflake} from "@/hooks/Snowflake";

export enum NewsTypeEnum {
  RSS = 1,
  CUSTOMER = 2
}

export interface NewsIndex {
  id: string;
  createTime: number;
  icon: string;
  name: string;
  type: NewsTypeEnum
}

export interface NewsRule {
  id: string;

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

  /**
   * 发布时间
   */
  pubDate?: Date;

  /**
   * 分类
   */
  category: Array<string>;

}

export interface NewsContent extends NewsIndex, NewsRule {
}

export function buildNewsContent(): NewsContent {
  return {
    id: useSnowflake().nextId(),
    createTime: Date.now(),
    icon: '',
    name: '',
    type: NewsTypeEnum.RSS,
    url: '',
    list: '',
    title: '',
    author: '',
    description: '',
    image: '',
    link: '',
    webview: false,
    wait: '',
    content: '// 此处返回html字符串，默认返回body\nreturn root.parseToString("body@html");'
  }
}