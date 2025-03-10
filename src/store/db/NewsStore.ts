import {defineStore} from "pinia";
import {NewsIndex} from "@/entity/news/NewsIndex";
import {listByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/modal/MessageUtil";

export const useNewsStore = defineStore('news', () => {
  const news = ref(new Array<NewsIndex>());
  const rev = ref<string>();

  async function init() {
    news.value = [];
    rev.value = undefined;
    try {
      const res = await listByAsync<NewsIndex>(LocalNameEnum.NEWS_LIST);
      news.value = res.list;
      rev.value = res.rev;
    } catch (e) {
      MessageUtil.info('初始化资讯失败');
    }
  }

  return {
    news,
  }
})