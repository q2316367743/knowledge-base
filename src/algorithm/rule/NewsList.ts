import {parse} from 'rss-to-json';
import {NewsContent, NewsInstance, NewsTypeEnum} from "@/entity/news";
import {request} from "@/algorithm/ParserEngine/bookUtil";
import {buildParseEngine} from "@/algorithm/ParserEngine";


export async function getNewsList(rule: NewsContent): Promise<Array<NewsInstance>> {
  if (rule.type === NewsTypeEnum.CUSTOMER) {
    // 自定义
    const rsp = await request(rule.url);
    const engine = buildParseEngine(rsp);
    const engines = engine.parseToEngines(rule.list);
    return engines.map((engine) => {
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
  }

  // 使用rss
  const rss = await parse(rule.url);
  console.log(rss.items)
  return  rss.items.map(item => {
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