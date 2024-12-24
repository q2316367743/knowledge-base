import { defineStore } from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { computed, ref, watch } from "vue";
import { useArticleStore } from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import { ArticleIndex } from "@/entity/article";
import { TocItem } from "@/editor/types/TocItem";
import { map } from "@/utils/lang/ArrayUtil";
import { useEventBus } from "@vueuse/core";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import { useUtoolsDbStorage } from "@/hooks/UtoolsDbStorage";

// 当前是否预览
export const preview = computed(() => {
    if (useHomeEditorStore().id) {
        const articleIndex = useArticleStore().articleMap.get(useHomeEditorStore().id);
        if (articleIndex) {
            return articleIndex.preview;
        }
    }
    return false;
});
// 当前编辑器类型
export const editorType = computed(() => {
    if (useHomeEditorStore().id) {
        const articleIndex = useArticleStore().articleMap.get(useHomeEditorStore().id);
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
    const indexes = ref(new Array<ArticleIndex>());
    const articleSort = useUtoolsDbStorage<ArticleSortEnum>(LocalNameEnum.KEY_HOME_SORT, ArticleSortEnum.CREATE_TIME_ASC)

    const id = useUtoolsDbStorage<number>(LocalNameEnum.KEY_HOME_EDITOR_ID, 0);
    const ids = useUtoolsDbStorage<Array<number>>(LocalNameEnum.KEY_HOME_EDITOR_IDS, []);
    const collapsed = ref<boolean>(false);
    const widthWrap = useUtoolsDbStorage<string>(LocalNameEnum.KEY_HOME_WIDTH, '264px');

    const width = computed(() => {
        if (collapsed.value) {
            return '0px';
        } else {
            return widthWrap.value
        }
    });

    async function init() {
        collapsed.value = widthWrap.value === '0px';

        useArticleStore().init().then(items => {
            const tempMap = map(items.filter(e => !e.isDelete), 'id');
            ids.value.map(e => openArticle(tempMap.get(e)))
            if (id.value > 0 && !ids.value.includes(id.value)) {
                openArticle(tempMap.get(id.value))
            }
            //  增加观察器
            watch(indexes, value => ids.value = value.map(e => e.id));
        });


    }

    function switchCollapsed(res?: boolean) {
        collapsed.value = typeof res === 'undefined' ? !collapsed.value : res;
    }

    function setId(res: number) {
        id.value = res;
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
        for(let i = 0;i < indexes.value.length; i++) {
            const value = indexes.value[i];
            if (value.id === id) {
                indexes.value[i] = article;
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

        if (indexes.value.findIndex(e => e.id === index.id) === -1) {
            // 没有打开
            indexes.value.push(index);
        }

        setId(index.id);

    }

    function closeArticle(...items: Array<number>) {
        for (let res of items) {

            const idx = indexes.value.findIndex(e => e.id === res);
            if (idx === -1) {
                return;
            }
            const target = indexes.value[idx].id;
            indexes.value.splice(idx, 1);
            if (target === id.value) {
                // 关闭自己
                if (indexes.value.length > 0) {
                    setId(indexes.value[indexes.value.length - 1].id);
                } else {
                    setId(0);
                }
            }
            if (indexes.value.length === 0) {
                if (collapsed.value) {
                    collapsed.value = false;
                }
            }
        }
    }

    function closeAll() {
        indexes.value = [];
        setId(0);
        if (collapsed.value) {
            collapsed.value = false;
        }
    }

    function closeOther(id: number) {
        indexes.value = indexes.value.filter(e => e.id === id);
        setId(id);
    }

    return {
        id,
        collapsed,
        width,
        widthWrap,
        articleSort,
        indexes,

        init,
        setId,
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
