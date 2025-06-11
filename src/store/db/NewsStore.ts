import {defineStore} from "pinia";
import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval';
import {NewsContent, NewsIndex, NewsInstanceCache, NewsRule} from "@/entity/news";
import {
  getFromOneByAsync,
  listByAsync,
  removeOneByAsync,
  saveListByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {debounce} from "radash";
import {download} from "@/utils/BrowserUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import {getNewsList} from "@/modules/NoteNews";

// 当前新闻的选择项
export const newsActiveKey = ref('');
// 收起
export const newsSideCollapse = ref(false);

export const useNewsStore = defineStore('news', () => {
  const news = ref(new Array<NewsIndex>());
  const rev = ref<string>();
  let isInit = false;
  const {data: newsMap} = useIDBKeyval<Record<string, NewsInstanceCache>>("cache-news-instances", {});

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

  async function getNews(id: string, refresh = false): Promise<NewsInstanceCache> {
    if (!refresh) {
      const target = newsMap.value[id];
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
    const target = {
      data: list,
      date: Date.now()
    };
    newsMap.value[id] = target;
    return target;
  }

  function getNewsIndex(id: string): NewsIndex | undefined {
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
        createTime: Date.now()
      });
    } else {
      news.value[index] = {
        ...news.value[index],
        name: res.name,
        icon: res.icon,
      }
      const old = await getFromOneByAsync<NewsRule>(`${LocalNameEnum.NEWS_RULE}/${res.id}`);
      rev = old.rev;
    }
    await saveOneByAsync<NewsRule>(`${LocalNameEnum.NEWS_RULE}/${res.id}`, {
      id: res.id,
      url: res.url,
      wait: res.wait,
      title: res.title,
      body: res.body,
      timeout: res.timeout,
      headers: res.headers,
      userAgent: res.userAgent,
    }, rev);
    await sync();
  }

  async function deleteNews(id: string) {
    const index = news.value.findIndex(e => e.id === id);
    if (index === -1) {
      return;
    }
    news.value.splice(index, 1);
    await sync();
    // 删除内容
    await removeOneByAsync(`${LocalNameEnum.NEWS_RULE}/${id}`, true)
    await sync();
  }

  const dbSync = debounce({delay: 300},
    () => {
      sync().then(() => console.debug("同步成功"))
        .catch(e => console.error("同步失败", e));
    })

  /**
   * 修改顺序，元素从from移动到to
   * @param from 原始索引
   * @param to 目标索引
   */
  function changeOrder(from: number, to: number) {
    if (from === to) return;
    news.value.splice(to, 0, news.value.splice(from, 1)[0]);
    dbSync();
  }

  async function exportNews() {
    const rules = new Array<NewsContent>()
    for (let n of news.value) {
      const rule = await getNewsRule(n.id);
      if (rule) {
        rules.push({
          ...n,
          ...rule
        })
      }
    }
    const text = JSON.stringify(rules);
    download(text, '资讯列表导出.json', 'text/plain');
  }

  async function importNews(text: string) {
    const items = JSON.parse(text) as Array<NewsContent>;
    for (const item of items) {
      await postNews({
        ...item,
        id: useSnowflake().nextId(),
        createTime: Date.now()
      });
    }
  }

  return {
    news,
    getNews, getNewsIndex, getNewsRule,
    postNews, deleteNews, changeOrder,
    exportNews, importNews
  }
})