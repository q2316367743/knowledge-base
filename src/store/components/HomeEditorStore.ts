import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, nextTick, ref} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import {TocItem} from "@/pages/home/layout/editor-content/editor/MarkdownEditor/common/TocItem";
import {map} from "@/utils/lang/ArrayUtil";
import {useEventBus} from "@vueuse/core";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import {MessageItem} from "@/store/setting/ChatSettingStore";

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
export const useUpdatePreviewEvent = useEventBus<{ id: number, preview: boolean }>('update-preview');
export const useArticleExportEvent = useEventBus<number>('article-export');
export const useArticleImportEvent = useEventBus<number>('article-import');


// 一些特殊的方法
export const getTextCount = ref<() => number>(() => 0);
export const getLineLength = ref<() => number>(() => 0);
export const getToc = ref<() => TocItem[]>(() => []);

export const robot = ref(true);
export const messages = ref(new Array<MessageItem>());

export const switchRobot = () => robot.value = !robot.value;

export function switchPreview() {
    useUpdatePreviewEvent.emit({id: useHomeEditorStore().id, preview: !preview.value});
    useArticleStore().updateIndex(useHomeEditorStore().id, {preview: !preview.value})
        .then(() => console.debug("自动更新文章预览状态"))
        .catch(e => MessageUtil.error("自动更新文章预览状态失败", e));
}


export const useHomeEditorStore = defineStore('home-editor', () => {

    // 打开的文章
    const indexes = ref(new Array<ArticleIndex>());
    const articleSort = ref(ArticleSortEnum.CREATE_TIME_ASC)

    const id = ref(0);
    const collapsed = ref(false);
    const widthWrap = ref('264px');

    const width = computed(() => {
        if (collapsed.value) {
            return '0px';
        } else {
            return widthWrap.value
        }
    });

    async function init() {
        id.value = getItemByDefault(LocalNameEnum.KEY_HOME_EDITOR_ID, 0);
        widthWrap.value = getItemByDefault(LocalNameEnum.KEY_HOME_WIDTH, '264px');
        collapsed.value = widthWrap.value === '0px';
        articleSort.value = getItemByDefault(LocalNameEnum.KEY_HOME_SORT, ArticleSortEnum.CREATE_TIME_ASC);

        useArticleStore().init().then(items => {
            const tempMap = map(items.filter(e => !e.isDelete), 'id');
            id.value > 0 && nextTick(() => openArticle(tempMap.get(id.value)))
        });

    }

    function switchCollapsed(res?: boolean) {
        collapsed.value = typeof res === 'undefined' ? !collapsed.value : res;
    }

    function setId(res: number) {
        id.value = res;
        setItem<number>(LocalNameEnum.KEY_HOME_EDITOR_ID, id.value);
    }

    function setWidth(width: string) {
        if (width === '0px' && collapsed.value) {
            return;
        }
        widthWrap.value = width;
        setItem<string>(LocalNameEnum.KEY_HOME_WIDTH, widthWrap.value);
    }

    function setSort(res: ArticleSortEnum) {
        articleSort.value = res;
        setItem(LocalNameEnum.KEY_HOME_SORT, articleSort.value);
    }

    function updateTitle(id: number, title: string) {
        for (let valueElement of indexes.value) {
            if (valueElement.id === id) {
                valueElement.name = title;
                return;
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

    return {
        id,
        collapsed,
        width,
        widthWrap,
        articleSort,

        init,
        switchCollapsed,
        setId,
        setWidth,
        setSort,
        updateTitle,

        indexes,
        openArticle,
        closeArticle

    }


});
