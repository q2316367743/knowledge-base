import {parse} from 'rss-to-json';
import {NewsArticle, NewsContent, NewsInstance, NewsRule} from "@/entity/news";
import {htmlDecode} from "@/utils/lang/DocumentUtil";
import {importWithUBrowser} from "@/modules/NoteImport/components/importWithUBrowser";

export async function getNewsList(rule: NewsContent): Promise<Array<NewsInstance>> {
  // 使用rss
  const rss = await parse(rule.url);
  const instances: Array<NewsInstance> = rss.items.map(item => {
    return {
      title: item.title,
      description: item.description,
      link: item.link,
      tags: item.category || [],
      author: item.author,
      image: '',
      pubDate: new Date(item.published),
      category: item.category || []
    }
  })

  instances.forEach(e => e.description = htmlDecode(e.description));

  return instances;

}

export async function getNewsArticle(link: string, rule: NewsRule): Promise<NewsArticle> {
  const res = await importWithUBrowser(link, rule);
  return {
    ...res,
    date: Date.now()
  }
}