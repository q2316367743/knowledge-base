import {useSnowflake} from "@/hooks/Snowflake";
import {NoteImportRule} from "@/modules/NoteImport/types";
import {CrawlerMarkdownResult} from "@/utils/utools/CrawlerUtil";

export interface NewsIndex {
  id: string;
  createTime: number;
  icon: string;
  name: string;
}

export interface NewsRule extends NoteImportRule {

  id: string;

  /**
   * 目标链接
   */
  url: string;

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

export interface NewsInstanceCache {
  date: number;
  data: Array<NewsInstance>;
}

export interface NewsContent extends NewsIndex, NewsRule {
}

export interface NewsArticle extends CrawlerMarkdownResult{
  date: number;
}

export function buildNewsContent(): NewsContent {
  return {
    id: useSnowflake().nextId(),
    createTime: Date.now(),
    icon: '',
    name: '',

    url: '',

    title: '',
    body: ''
  }
}