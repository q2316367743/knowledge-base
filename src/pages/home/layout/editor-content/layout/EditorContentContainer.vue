<template>
    <!-- 编辑区 -->
    <div class="ec-container-item" v-if="articleIndex" style="height: 100%">
        <markdown-editor v-model="content" :preview="preview" ref="mdEditor" :article-id="articleIndex.id"
                         v-if="editorType === ArticleTypeEnum.MARKDOWN && load"/>
        <wang-editor v-model="content" :read-only="preview" ref="weEditor" :article-id="articleIndex.id"
                     v-else-if="editorType === ArticleTypeEnum.RICH_TEXT && load"/>
        <monaco-editor v-model="content" :language="language" :read-only="preview" :article-id="articleIndex.id"
                       v-else-if="editorType === ArticleTypeEnum.CODE && load"/>
        <excel-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                      v-else-if="editorType === ArticleTypeEnum.EXCEL && load"/>
        <mind-map-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                         v-else-if="editorType === ArticleTypeEnum.MIND_MAP && load"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, onBeforeUnmount, PropType, ref, watch} from "vue";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
// 编辑器
import WangEditor from "@/pages/home/layout/editor-content/editor/wang-editor.vue";
import MonacoEditor from "@/pages/home/layout/editor-content/editor/monaco-editor/index.vue";
import MarkdownEditor from "@/pages/home/layout/editor-content/editor/markdown-editor/index.vue";
import ExcelEditor from "@/pages/home/layout/editor-content/editor/ExcelEditor/index.vue";
import MindMapEditor from "@/pages/home/layout/editor-content/editor/MindMapEditor/index.vue";

import {ArticleIndex} from "@/entity/article";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {parseFileExtra} from "@/utils/file/FileUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useSaveContentEvent, useUpdatePreviewEvent} from "@/store/components/HomeEditorStore";

const props = defineProps({
    articleIndex: Object as PropType<ArticleIndex>
});

const load = ref(false);
// 文章内容，不一定是文本
const content = ref<any>('');
let contentRev: string | undefined = undefined;
// 计算属性
const preview = computed(() => props.articleIndex ? props.articleIndex.preview : false);
const language = computed(() => {
    if (!props.articleIndex) {
        return '';
    }
    if (props.articleIndex.type !== ArticleTypeEnum.CODE) {
        return '';
    }
    return parseFileExtra(props.articleIndex.name);
});
const editorType = computed(() => {
    if (!props.articleIndex) {
        return null;
    }
    return props.articleIndex.type || ArticleTypeEnum.MARKDOWN;
});


async function saveContent(value: any) {
    if (!props.articleIndex) {
        return;
    }
    try {
        contentRev = await useArticleStore().updateContent(props.articleIndex.id, value, contentRev);
    } catch (e) {
        MessageUtil.error("自动保存文章失败", e);
    }
}

watch(() => content.value, value => {
    if (!props.articleIndex) {
        return;
    }
    if (!load.value) {
        console.debug("自动保存文章，但未加载完成")
        return;
    }
    saveContent(value).then(() => console.debug("自动保存文章成功"))
        .catch(e => MessageUtil.error("自动保存文章失败", e));
}, {deep: true});


async function initArticle(articleId: number) {

    if (articleId == 0) {
        return;
    }

    await useArticleStore().init();

    const articleIndexWrap = useArticleStore().articleMap.get(articleId);
    if (!articleIndexWrap) {
        MessageUtil.error(`文章【${articleId}】未找到，请刷新后重试！`);
        return;
    }
    // 内容
    const contentWrap = await getFromOneByAsync<ArticleContent<any>>(LocalNameEnum.ARTICLE_CONTENT + articleId);
    if (contentWrap.record) {
        content.value = contentWrap.record.content;


        load.value = true;
    }
    contentRev = contentWrap.rev;

}

onMounted(() => {
    if (!props.articleIndex) {
        return;
    }
    initArticle(props.articleIndex.id);

    useSaveContentEvent.off(onSave);
    useUpdatePreviewEvent.off(onPreview);
    useSaveContentEvent.on(onSave);
    useUpdatePreviewEvent.on(onPreview);
});

onBeforeUnmount(() => {
    useSaveContentEvent.off(onSave);
    useUpdatePreviewEvent.off(onPreview);
});

function onSave(id: number) {
    if (props.articleIndex) {
        if (props.articleIndex.type !== ArticleTypeEnum.EXCEL) {
            if (id === props.articleIndex.id) {
                saveContent(content.value);
            }
        }
    }
}

function onPreview(data: { id: number, preview: boolean }) {
    if (props.articleIndex) {
        if (props.articleIndex.id === data.id) {
            props.articleIndex.preview = data.preview;
        }
    }
}


</script>
<style scoped>

</style>
