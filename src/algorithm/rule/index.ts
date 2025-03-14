import {parse} from 'rss-to-json';
import {NewsArticle, NewsContent, NewsInstance, NewsRule, NewsTypeEnum} from "@/entity/news";
import {request} from "@/algorithm/ParserEngine/bookUtil";
import {buildParseEngine} from "@/algorithm/ParserEngine";
import {htmlDecode} from "@/utils/lang/DocumentUtil";

export async function getNewsList(rule: NewsContent): Promise<Array<NewsInstance>> {
  let instances: Array<NewsInstance>;
  if (rule.type === NewsTypeEnum.CUSTOMER) {
    // 自定义
    const rsp = await request(rule.url);
    const engine = buildParseEngine(rsp);
    const engines = engine.parseToEngines(rule.list);
    instances =  engines.map((engine) => {
      return {
        title: engine.parseToString(rule.title),
        author: engine.parseToString(rule.author),
        description: engine.parseToString(rule.description),
        image: engine.parseToString(rule.image),
        link: engine.parseToString(rule.link),
        pubDate: new Date(),
        category: []
      }
    });
  }else {
    // 使用rss
    const rss = await parse(rule.url);
    instances =  rss.items.map(item => {
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
  }

  instances.forEach(e => e.description =  htmlDecode(e.description));

  return instances;

}

export async function getNewsArticle(link: string, rule: NewsRule): Promise<NewsArticle> {
  const rsp = await request(link);
  const engine = buildParseEngine(rsp);
  const func = new Function('root', rule.content);
  const html = func(engine);
  return {
    html: `${html}`,
    date: Date.now()
  }
}