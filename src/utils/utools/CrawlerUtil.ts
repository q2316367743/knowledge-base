import {parse} from 'rss-to-json';
import {InjectionWebResult, http} from '@/utils/utools/common';
import {NewsInstance} from "@/entity/news";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

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

export interface CrawlerResult {
  html: string;
}

export interface CrawlerMarkdownResult extends CrawlerResult {
  title: string;
  markdown: string;
}

// 从uTools爬取数据
async function fetchMarkdownByUTools(url: string, props?: CrawlerMarkdownProps): Promise<CrawlerMarkdownResult> {
  const {headers, timeout, wait, title, body, userAgent} = props || {};
  let uBrowser = utools.ubrowser.goto(url, {
    ...headers as any,
    userAgent
  }, timeout);
  if (wait) {
    // 等待元素出现
    if (typeof wait === 'number') {
      uBrowser = uBrowser.wait(wait);
    } else {
      uBrowser = uBrowser.wait(wait, timeout);
    }
  }
  // 获取html
  uBrowser = uBrowser.evaluate(() => {
    // 处理img可能存在的问题，有些图片的链在data-src中
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute("src");
      if (!src || !/^https?:\/\//.test(src)) {
        // 错误的链接
        for (let i = 0; i < img.attributes.length; i++) {
          const attribute = img.attributes[i]
          if (/^https?:\/\//.test(attribute.value)) {
            const match = attribute.value.match(/(https?:\/\/\S+)/g);
            if (match) {
              const value = match[0];
              if (value) {
                img.setAttribute('src', value);
                return;
              }
            }
          }
        }
      }
    });
    return document.body.outerHTML
  });
  uBrowser = uBrowser.markdown(body || 'body');
  const results = await uBrowser.run({
    show: false
  });
  const html = results[0] as string;
  let markdown = results[1] as string;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const domTitle = doc.querySelector('title')?.innerText;
  const ruleTitle = title ? doc.querySelector(title)?.textContent : '';

  // markdown需要处理，![.*](.*)要变成![.*#100%](.*)
  markdown = markdown.replace(/!\[.*]\(.*\)/g, (match) => {
    return match.replace(/!\[.*]/, '![' + match.split('[')[1].split(']')[0] + '#100%]');
  });

  return {
    title: ruleTitle || domTitle || '',
    html,
    markdown
  };
}

export const CrawlerUtil = {
  fetchMarkdown: async (url: string, props?: CrawlerMarkdownProps): Promise<CrawlerMarkdownResult> => {
    if (window['utools']) {
      return fetchMarkdownByUTools(url, props);
    } else {
      const rsp = await http.post<InjectionWebResult<CrawlerMarkdownResult>>('/crawler/markdown', {url, props});
      return rsp.data.data;
    }
  },
  rss: async (url: string): Promise<Array<NewsInstance>> => {
    if (InjectionUtil.env.isUtools()) {
      const rss = await parse(url);
      return rss.items.map(item => {
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
    } else {
      const rsp = await http.get<InjectionWebResult<Array<NewsInstance>>>('/crawler/rss', {
        params: {url}
      });
      return rsp.data.data;
    }
  }
}