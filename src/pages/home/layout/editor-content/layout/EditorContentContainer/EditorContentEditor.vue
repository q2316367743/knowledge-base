<template>
    <!-- 编辑区 -->
    <div class="ec-container-item" v-if="articleIndex">
        <markdown-editor v-model="content" :preview="preview" ref="mdEditor" :article-id="articleIndex.id"
                         v-if="editorType === ArticleTypeEnum.MARKDOWN && load" @send-to-chat="sendToChat"/>
        <rich-text-editor v-model="content" :read-only="preview" ref="weEditor" :article-id="articleIndex.id"
                     v-else-if="editorType === ArticleTypeEnum.RICH_TEXT && load"/>
        <monaco-editor v-model="content" :language="language" :read-only="preview" :article-id="articleIndex.id"
                       v-else-if="editorType === ArticleTypeEnum.CODE && load"/>
        <excel-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                      v-else-if="editorType === ArticleTypeEnum.EXCEL && load"/>
        <mind-map-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                         v-else-if="editorType === ArticleTypeEnum.MIND_MAP && load"/>
        <drauu-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                      v-else-if="editorType === ArticleTypeEnum.DRAUU && load"/>
        <handsontable-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                             v-else-if="editorType === ArticleTypeEnum.HANDSONTABLE && load"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, onBeforeUnmount, PropType, ref, watch} from "vue";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
// 编辑器
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import MonacoEditor from "@/editor/MonacoEditor/index.vue";
import MarkdownEditor from "@/editor/MarkdownEditor/index.vue";
import ExcelEditor from "@/editor/ExcelEditor/index.vue";
import MindMapEditor from "@/editor/MindMapEditor/index.vue";
import DrauuEditor from "@/editor/DrauuEditor/index.vue";
import HandsontableEditor from "@/editor/HandsontableEditor/index.vue";

import {ArticleIndex} from "@/entity/article";
import {ArticleContent} from "@/entity/article/ArticleContent";
import {parseFileExtra} from "@/utils/file/FileUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useArticlePreviewEvent, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

const props = defineProps({
    articleIndex: Object as PropType<ArticleIndex>
});
const emits = defineEmits(['sendToChat']);
defineExpose({insertToArticle});

const load = ref(false);
// 文章内容，不一定是文本
const content = ref<any>('');
let contentRev: string | undefined = undefined;

const mdEditor = ref();

function buildPreview(): boolean {
    // 判断是否设置了仅预览
    if (props.articleIndex) {
        const {mdEditorEditMode} = useBaseSettingStore()
        if (props.articleIndex.type === ArticleTypeEnum.MARKDOWN && mdEditorEditMode === MdEditorEditModeEnum.PREVIEW) {
            return true;
        }
        return props.articleIndex.preview;
    }
    return false;
}

// 计算属性
const preview = ref<boolean>(buildPreview());
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
    contentRev = await useArticleStore().updateContent(props.articleIndex.id, value, contentRev);
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

    useArticlePreviewEvent.off(onPreview);
    useArticlePreviewEvent.on(onPreview);
});

onBeforeUnmount(() => {
    useArticlePreviewEvent.off(onPreview);
});

function onPreview(id: number) {
    if (props.articleIndex) {
        if (props.articleIndex.id === id) {
            preview.value = !preview.value;
            // 此处处理
            useArticleStore().updateIndex(id, {preview: preview.value})
                .then(res => {
                    useHomeEditorStore().update(id, res);
                    console.debug("自动更新文章预览状态");
                })
                .catch(e => MessageUtil.error("自动更新文章预览状态失败", e));
        }
    }
}

function insertToArticle(str: string) {
    if (editorType.value === ArticleTypeEnum.MARKDOWN) {
        mdEditor.value.onInsert(str);
    }
}

function sendToChat(str: string) {
    emits('sendToChat', str);
}


</script>
<style scoped>
.ec-container-item {
    position: relative;
    width: 100%;
    height: calc(100% - 3px);
}

</style>
