import {defineStore} from "pinia";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, nextTick, ref} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import {TocItem} from "@/pages/home/layout/editor-content/editor/markdown-editor/common/TocItem";
import {map} from "@/utils/ArrayUtil";
import {useEventBus} from "@vueuse/core";

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
            return articleIndex.type;
        }
    }
    return null;
});

// 一些事件
export const useSaveContentEvent = useEventBus('save-content');
export const useUpdatePreviewEvent = useEventBus<{ id: number, preview: boolean }>('update-preview');


// 一些特殊的方法
export const getTextCount = ref<() => number>(() => 0);
export const getLineLength = ref<() => number>(() => 0);
export const getToc = ref<() => TocItem[]>(() => []);


export function switchPreview() {
    useUpdatePreviewEvent.emit({id: useHomeEditorStore().id, preview: !preview.value});
    useArticleStore().updateIndex(useHomeEditorStore().id, {preview: !preview.value})
        .then(() => console.debug("自动更新文章预览状态"))
        .catch(e => MessageUtil.error("自动更新文章预览状态失败", e));
}


export const useHomeEditorStore = defineStore('home-editor', () => {

    // 打开的文章
    const indexes = ref(new Array<ArticleIndex>());

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
        useSaveContentEvent.emit();
        for (let res of items) {

            const idx = indexes.value.findIndex(e => e.id === res);
            if (idx === -1) {
                console.debug(`文章【${res}】并没有打开，无需关闭`)
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
        }
    }

    return {
        id,
        collapsed,
        width,
        widthWrap,
        init,
        switchCollapsed,
        setId,
        setWidth,

        indexes,
        openArticle,
        closeArticle

    }


});
