import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import {TocItem} from "@/editor/types/TocItem";
import {useEventBus} from "@vueuse/core";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";


// 当前打开的编辑器
export const homeEditorId = useUtoolsKvStorage<number>(LocalNameEnum.KEY_HOME_EDITOR_ID, 0);
// 编辑器列表
export const homeEditorIds = useUtoolsDbStorage<Array<number>>(LocalNameEnum.KEY_HOME_EDITOR_IDS, []);
export const homeEditorArticles = computed<Array<ArticleIndex>>(() => {
  const {articleMap} = useArticleStore();
  if (homeEditorIds.value.length === 0) {
    return [];
  }
  const list = new Array<ArticleIndex>();
  for (let editorId of homeEditorIds.value) {
    const one = articleMap.get(editorId);
    if (one) list.push(one);
  }
  return list;
})


// 当前是否预览
export const preview = computed(() => {
  if (homeEditorId.value) {
    const articleIndex = useArticleStore().articleMap.get(homeEditorId.value);
    if (articleIndex) {
      return articleIndex.preview;
    }
  }
  return false;
});
// 当前编辑器类型
export const editorType = computed(() => {
  if (homeEditorId.value) {
    const articleIndex = useArticleStore().articleMap.get(homeEditorId.value);
    if (articleIndex) {
      return articleIndex.type || ArticleTypeEnum.MARKDOWN;
    }
  }
  return null;
});

// 一些事件
export const useUpdateRobotEvent = useEventBus<number>('update-robot');
export const useArticleExportEvent = useEventBus<number>('article-export');
export const useArticleImportEvent = useEventBus<number>('article-import');
// 切换预览
export const useArticlePreviewEvent = useEventBus<number>('article-preview');


// 一些特殊的方法
export const getTextCount = ref<() => number>(() => 0);
export const getLineLength = ref<() => number>(() => 0);
export const getToc = ref<() => TocItem[]>(() => []);

export const useHomeEditorStore = defineStore('home-editor', () => {

  // 打开的文章
  const articleSort = useUtoolsKvStorage<ArticleSortEnum>(LocalNameEnum.KEY_HOME_SORT, ArticleSortEnum.CREATE_TIME_ASC)

  const collapsed = ref<boolean>(false);
  const widthWrap = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_WIDTH, '264px');

  const width = computed(() => {
    if (collapsed.value) {
      return '0px';
    } else {
      return widthWrap.value
    }
  });

  async function init() {
    collapsed.value = widthWrap.value === '0px';

   await useArticleStore().init();

  }

  function switchCollapsed(res?: boolean) {
    collapsed.value = typeof res === 'undefined' ? !collapsed.value : res;
  }


  function setWidth(width: string) {
    if (width === '0px' && collapsed.value) {
      return;
    }
    widthWrap.value = width;
  }

  function setSort(res: ArticleSortEnum) {
    articleSort.value = res;
  }

  function update(id: number, article: ArticleIndex) {
    for (let i = 0; i < homeEditorArticles.value.length; i++) {
      const value = homeEditorArticles.value[i];
      if (value.id === id) {
        homeEditorArticles.value[i] = article;
        return
      }
    }
  }

  function openArticle(res: number | ArticleIndex | undefined) {
    if (!res) {
      return;
    }
    let index: ArticleIndex;
    if (typeof res === 'number') {

      const temp = useArticleStore().articleMap.get(res);
      if (!temp) {
        MessageUtil.error(`文章[${res}]不存在`);
        return;
      }
      index = temp;
    } else {
      index = res;
    }

    if (homeEditorIds.value.findIndex(e => e === index.id) === -1) {
      // 没有打开
      homeEditorIds.value.push(index.id);
    }
    homeEditorId.value = index.id;
  }

  function closeArticle(...items: Array<number>) {
    for (let res of items) {

      const idx = homeEditorIds.value.findIndex(e => e === res);
      if (idx === -1) {
        return;
      }
      const target = homeEditorIds.value[idx];
      homeEditorIds.value.splice(idx, 1);
      if (target === homeEditorId.value) {
        // 关闭自己
        if (homeEditorIds.value.length > 0) {
          homeEditorId.value = homeEditorIds.value[homeEditorIds.value.length - 1];
        } else {
          homeEditorId.value = 0;
        }
      }
      if (homeEditorIds.value.length === 0) {
        if (collapsed.value) {
          collapsed.value = false;
        }
      }
    }
  }

  function closeAll() {
    homeEditorIds.value = [];
    homeEditorId.value = 0;
    if (collapsed.value) {
      collapsed.value = false;
    }
  }

  function closeOther(id: number) {
    homeEditorIds.value = homeEditorIds.value.filter(e => e === id);
    homeEditorId.value = id;
  }

  return {
    collapsed,
    width,
    widthWrap,
    articleSort,

    init,
    switchCollapsed,
    setWidth,
    setSort,
    update,

    // 标签栏管理
    openArticle,
    closeArticle,
    closeAll,
    closeOther

  }


});
