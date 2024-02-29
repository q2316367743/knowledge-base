import {defineStore} from "pinia";
import {getFromOneByAsync, getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, nextTick, ref, watch} from "vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {parseFileExtra} from "@/utils/FileUtil";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {TocItem} from "@/pages/home/layout/editor-content/editor/markdown-editor/common/TocItem";

// 文章索引
export const articleIndex = ref<ArticleIndex | null>(null);
// 文章是否可用
export const articleAvailable = ref(false);
// 文章标题
export const title = ref('');
// 文章内容，不一定是文本
export const content = ref<any>('');
let contentRev: string | undefined = undefined;
// 计算属性
export const preview = computed(() => articleIndex.value ? articleIndex.value.preview : false);
export const language = computed(() => {
    if (!articleIndex.value) {
        return '';
    }
    if (articleIndex.value.type !== ArticleTypeEnum.CODE) {
        return '';
    }
    return parseFileExtra(title.value);
});
export const editorType = computed(() => {
    if (!articleIndex.value) {
        return null;
    }
    return articleIndex.value.type;
});
export const supportAutoSave = computed(() => articleIndex.value && articleIndex.value.type !== ArticleTypeEnum.EXCEL);


// 一些特殊的方法
export const getTextCount = ref<() => number>(() => content.value.length);
export const getLineLength = ref<() => number>(() => content.value.split('\n').length);
export const getToc = ref<() => TocItem[]>(() => []);
export const getContent = ref<() => any>(() => content.value);

export function saveTitle() {
    useArticleStore().updateIndex(useHomeEditorStore().id, {name: title.value})
        .then(() => console.debug("自动更新文章名称"))
        .catch(e => MessageUtil.error("自动更新文章名称失败", e));
}

export function switchPreview() {
    if (articleIndex.value) {
        articleIndex.value.preview = !articleIndex.value.preview;
    }
    useArticleStore().updateIndex(useHomeEditorStore().id, {preview: preview.value})
        .then(() => console.debug("自动更新文章预览状态"))
        .catch(e => MessageUtil.error("自动更新文章预览状态失败", e));
}

export async function saveContent(value: any) {
    try {
        contentRev = await useArticleStore().updateContent(useHomeEditorStore().id, value, contentRev);
    } catch (e) {
        MessageUtil.error("自动保存文章失败", e);
    }
}

watch(() => content.value, value => {
    if (!articleAvailable.value) {
        return;
    }
    if (!supportAutoSave.value) {
        return;
    }
    saveContent(value).then(() => console.debug("自动保存文章成功"))
        .catch(e => MessageUtil.error("自动保存文章失败", e));
});


async function initArticle(articleId: number) {

    articleAvailable.value = false;
    // 先清空内容
    articleIndex.value = null;
    title.value = '';
    content.value = '';
    getTextCount.value = () => content.value.length;
    getLineLength.value = () => content.value.split('\n').length;
    getContent.value = () => content.value;

    if (articleId == 0) {
        return;
    }

    await useArticleStore().init();

    const articleIndexWrap = useArticleStore().articleMap.get(useHomeEditorStore().id);
    if (!articleIndexWrap) {
        MessageUtil.error(`文章【${articleId}】未找到，请刷新后重试！`);
        return;
    }
    articleIndex.value = articleIndexWrap;
    title.value = articleIndexWrap.name;
    // 内容
    const contentWrap = await getFromOneByAsync<ArticleContent<any>>(LocalNameEnum.ARTICLE_CONTENT + useHomeEditorStore().id);
    if (contentWrap.record) {
        content.value = contentWrap.record.content;
    }
    contentRev = contentWrap.rev;
    nextTick(() => articleAvailable.value = true).then(() => console.debug("文章加载完成"))
}

export const useHomeEditorStore = defineStore('home-editor', () => {
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
        initArticle(id.value).then(() => console.debug("初始化文章完成"));
    }

    function switchCollapsed(res?: boolean) {
        collapsed.value = typeof res === 'undefined' ? !collapsed.value : res;
    }

    function setId(res: number) {
        id.value = res;
        setItem<number>(LocalNameEnum.KEY_HOME_EDITOR_ID, id.value);
        initArticle(res).then(() => console.debug("设置文章完成"));
    }

    function setWidth(width: string) {
        if (width === '0px' && collapsed.value) {
            return;
        }
        widthWrap.value = width;
        setItem<string>(LocalNameEnum.KEY_HOME_WIDTH, widthWrap.value);
    }

    return {
        id,
        collapsed,
        width,
        widthWrap,
        init,
        switchCollapsed,
        setId,
        setWidth

    }


});
