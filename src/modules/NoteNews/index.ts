import {NewsArticle, NewsContent, NewsInstance, NewsRule} from "@/entity/news";
import {htmlDecode} from "@/utils/lang/DocumentUtil";
import {CrawlerUtil} from "@/utils/utools/CrawlerUtil";

export async function getNewsList(rule: NewsContent): Promise<Array<NewsInstance>> {
  const instances = await CrawlerUtil.rss(rule.url);
  instances.forEach(e => e.description = htmlDecode(e.description));
  return instances;

}

export async function getNewsArticle(link: string, rule: NewsRule): Promise<NewsArticle> {
  const res = await CrawlerUtil.fetchMarkdown(link, rule);
  return {
    ...res,
    date: Date.now()
  }
}