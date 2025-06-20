import {defineStore} from "pinia";
import {
  Article,
  ArticleBase,
  ArticleIndex,
  getDefaultArticleBase,
  getDefaultArticleIndex
} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {group, map} from "@/utils/lang/ArrayUtil";
import {toRaw} from "vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {
  getFromOneByAsync,
  listByAsync,
  removeOneByAsync,
  saveListByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {useAsyncDebounce} from "@/hooks/AsyncDebounce";


export const useArticleStore = defineStore('article', () => {
  const state = ref(new Array<ArticleIndex>());
  const rev = ref<string>();
  let isInit = false;

  const articles = computed(() => state.value.filter(e => !e.isDelete).sort((a, b) => b.id - a.id));
  const articleDeletes = computed(() => state.value.filter(e => e.isDelete));
  const articleMap = computed(() => map(state.value.filter(e => !e.isDelete), 'id'));
  const categoryMap = computed<Map<number | null, Array<ArticleIndex>>>(() => {
    const articles = state.value.filter(e => !e.isDelete).sort((a, b) => a.name.localeCompare(b.name));
    return group(articles, 'categoryId') as Map<number | null, Array<ArticleIndex>>;
  });
  const folderMap = computed(() => {
    const articles = state.value.filter(e => !e.isDelete).sort((a, b) => a.name.localeCompare(b.name));
    return group(articles, 'folder')
  });
  const articleNames = computed(() => {
    const names = new Set<string>();
    for (let item of state.value.filter(e => !e.isDelete)) {
      names.add(item.name);
    }
    return names;
  });

  async function init(force: boolean = false): Promise<Array<ArticleIndex>> {
    if (isInit && !force) {
      return state.value;
    }
    const res = await listByAsync<ArticleIndex>(LocalNameEnum.ARTICLE);
    state.value = res.list;
    rev.value = res.rev;
    isInit = true;
    return state.value;
  }

  const _sync = useAsyncDebounce(async () => {
    rev.value = await saveListByAsync(LocalNameEnum.ARTICLE, state.value, rev.value);
  }, 300);

  async function add(article: Omit<ArticleIndex, 'id' | 'createTime' | 'updateTime'>, base: ArticleBase, content: any): Promise<ArticleIndex> {
    // 校验
    if (article.name.trim() === '') {
      return Promise.reject("笔记标题不能为空");
    }
    const now = new Date();
    const id = now.getTime();

    // 新增内容
    await saveOneByAsync(
      LocalNameEnum.ARTICLE_CONTENT + id,
      {
        content
      } as ArticleContent
    );

    // 新增基础信息
    await saveOneByAsync(
      LocalNameEnum.ARTICLE_BASE + id,
      toRaw(base)
    )

    const target = getDefaultArticleIndex({
      ...article,
      createTime: now,
      updateTime: now,
      id,
    });
    // 新增索引
    state.value.push(target);
    _sync();
    return Promise.resolve(target);
  }

  async function updateIndex(id: number, article: Partial<ArticleIndex>): Promise<ArticleIndex> {
    const index = state.value.findIndex(e => e.id === id);
    if (index === -1) {
      await MessageBoxUtil.confirm("笔记未找到，是否新增笔记", "更新失败", {
        confirmButtonText: "新增",
        cancelButtonText: "取消"
      });
      return add(Object.assign(getDefaultArticleIndex(), article), getDefaultArticleBase(), "");
    }
    // 新增索引
    state.value[index] = {
      ...state.value[index],
      ...article,
      updateTime: new Date(),
    };

    _sync();

    return state.value[index];
  }

  async function updateMultiIndex(articles: Array<Pick<ArticleIndex, 'id'> & Partial<ArticleIndex>>) {
    for (let article of articles) {
      const index = state.value.findIndex(e => e.id === article.id);
      if (index === -1) {
        continue;
      }
      // 新增索引
      state.value[index] = {
        ...state.value[index],
        ...article,
        updateTime: new Date(),
      };
    }
    _sync();
  }

  function getContent<T = any>(id: number) {
    return getFromOneByAsync<ArticleContent<T>>(LocalNameEnum.ARTICLE_CONTENT + id)
  }

  async function updateContent(id: number, content: string, rev?: undefined | string, article?: Partial<ArticleIndex>): Promise<undefined | string> {
    if (article) {
      await updateIndex(id, article);
    }
    return saveOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + id, {
      content
    }, rev);
  }

  async function updateBase(id: number, article: Partial<ArticleIndex>, base: ArticleBase, rev: undefined | string): Promise<string | undefined> {
    await updateIndex(id, article);
    return saveOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + id, base, rev);
  }

  async function removeRealById(id: number) {
    const index = state.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("动态未找到，请刷新后重试！");
    }
    // 删除索引
    state.value.splice(index, 1);
    _sync();
    // 删除内容
    await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
    // 删除评论
    await removeOneByAsync(LocalNameEnum.ARTICLE_COMMENT + id, true);
    // 如果当前就是这个笔记，则清除
    useHomeEditorStore().closeArticle(id);
  }

  async function removeRealByIds(ids: Array<number>) {
    state.value = state.value.filter(e => ids.indexOf(e.id) === -1);
    // 删除索引
    _sync();
    for (let id of ids) {
      // 删除基础信息
      await removeOneByAsync(LocalNameEnum.ARTICLE_BASE + id, true);
      // 删除内容
      await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
      // 删除评论
      await removeOneByAsync(LocalNameEnum.ARTICLE_COMMENT + id, true);
    }
    // 如果当前就是这个笔记，则清除
    useHomeEditorStore().closeArticle(...ids);
  }

  async function drop(id: number, pid: number) {
    const index = state.value.findIndex(e => e.id === id);
    if (index === -1) {
      return Promise.reject("笔记未找到，请刷新后重试！");
    }
    if (state.value[index].folder === pid) {
      return Promise.resolve();
    }
    state.value[index] = {
      ...state.value[index],
      folder: pid,
      updateTime: new Date(),
    }
    // 同步
    _sync();
  }

  async function removeById(id: number) {
    await updateIndex(id, {
      isDelete: true
    });
    useHomeEditorStore().closeArticle(id);
  }

  async function removeBatchByIds(ids: Array<number>) {
    await updateMultiIndex(ids.map(id => ({
      id: id,
      isDelete: true
    })));
    // 如果当前就是这个笔记，则清除
    useHomeEditorStore().closeArticle(...ids);
  }

  async function removeFolder(folderId: number) {
    let articleIndices = folderMap.value.get(folderId);
    if (!articleIndices) {
      return;
    }
    await updateMultiIndex(articleIndices.map(e => ({
      id: e.id,
      isDelete: true
    })));
    useHomeEditorStore().closeArticle(...articleIndices.map(e => e.id));
    return Promise.resolve();
  }

  async function getArticleById(id: number): Promise<Article | null> {
    const idx = articleMap.value.get(id);
    if (!idx) {
      return null;
    }

    const content = await getFromOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + id);
    const base = await getFromOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + id);
    if (!content.record) {
      return null;
    }
    return {
      index: idx,
      content: content.record,
      base: getDefaultArticleBase(base.record || {})
    }
  }

  return {
    articles, articleDeletes, articleMap, categoryMap, folderMap, articleNames,
    init,
    add, drop,
    getArticleById, getContent,
    updateIndex, updateContent, updateBase, updateMultiIndex,
    removeById, removeBatchByIds, removeRealById, removeRealByIds, removeFolder,
  }
})