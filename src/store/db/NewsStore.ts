import {defineStore} from "pinia";
import {NewsContent, NewsIndex, NewsInstance, NewsRule} from "@/entity/news";
import {getFromOneByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {getNewsList} from "@/algorithm/rule/NewsList";

// 当前新闻的选择项
export const newsActiveKey = ref('');
// 收起
export const newsSideCollapse = ref(false);

export const useNewsStore = defineStore('news', () => {
  const news = ref(new Array<NewsIndex>());
  const rev = ref<string>();
  let isInit = false;

  const newsMap = new Map<string, Array<NewsInstance>>();

  async function init() {
    if (isInit) return;
    isInit = true;
    news.value = [];
    rev.value = undefined;
    const res = await listByAsync<NewsIndex>(LocalNameEnum.NEWS_LIST);
    news.value = res.list;
    rev.value = res.rev;
  }

  init().then(() => console.log('NewsStore init success'))
    .catch(e => console.error('NewsStore init error', e));

  async function sync() {
    rev.value = await saveListByAsync<NewsIndex>(LocalNameEnum.NEWS_LIST, news.value, rev.value);
  }

  async function getNews(id: string, refresh = false): Promise<Array<NewsInstance>> {
    if (!refresh) {
      const target = newsMap.get(id);
      if (target) {
        return target;
      }
    }
    // 获取新闻
    const newsIndex = news.value.find(e => e.id === id);
    if (!newsIndex) {
      return Promise.reject(new Error("新闻不存在"));
    }
    // 获取内容
    const rule = await getNewsRule(id);
    if (!rule) {
      return Promise.reject(new Error("新闻规则不存在"));
    }
    const list = await getNewsList({
      ...newsIndex,
      ...rule
    });
    newsMap.set(id, list);
    return list;
  }

  function getNewsIndex(id: string) {
    return news.value.find(e => e.id === id);
  }

  async function getNewsRule(id: string) {
    const item = await getFromOneByAsync<NewsRule>(`${LocalNameEnum.NEWS_RULE}/${id}`);
    return item.record;
  }

  async function postNews(res: NewsContent) {
    const index = news.value.findIndex(e => e.id === res.id);
    let rev: string | undefined;
    if (index === -1) {
      // 新增
      news.value.push({
        id: res.id,
        name: res.name,
        icon: res.icon,
        type: res.type,
        createTime: Date.now()
      });
    } else {
      news.value[index] = {
        ...news.value[index],
        name: res.name,
        icon: res.icon,
        type: res.type,
      }
      const old = await getFromOneByAsync<NewsRule>(`${LocalNameEnum.NEWS_RULE}/${res.id}`);
      rev = old.rev;
    }
    await saveOneByAsync<NewsRule>(`${LocalNameEnum.NEWS_RULE}/${res.id}`, {
      id: res.id,
      url: res.url,
      list: res.list,
      title: res.title,
      author: res.author,
      description: res.description,
      image: res.image,
      link: res.link,
      webview: res.webview,
      wait: res.wait,
      content: res.content,
    }, rev);
    await sync();
  }

  return {
    news,
    getNews, getNewsIndex, getNewsRule,
    postNews
  }
})