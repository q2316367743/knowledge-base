<template>
  <!-- 编辑区 -->
  <div class="ec-container-item" v-if="articleIndex && load">
    <markdown-editor v-model="content" :preview="preview" ref="mdEditor" :article-id="articleIndex.id"
                     v-if="editorType === ArticleTypeEnum.MARKDOWN" @send-to-chat="sendToChat"/>
    <rich-text-editor v-model="content" :read-only="preview" ref="weEditor" :article-id="articleIndex.id"
                      v-else-if="editorType === ArticleTypeEnum.RICH_TEXT"/>
    <monaco-editor v-model="content" :language="language" :read-only="preview" :article-id="articleIndex.id"
                   v-else-if="editorType === ArticleTypeEnum.CODE" :file-name="articleIndex.name"/>
    <excel-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                  v-else-if="editorType === ArticleTypeEnum.EXCEL"/>
    <mind-map-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                     v-else-if="editorType === ArticleTypeEnum.MIND_MAP"/>
    <drauu-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                  v-else-if="editorType === ArticleTypeEnum.DRAUU"/>
    <handsontable-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                         v-else-if="editorType === ArticleTypeEnum.HANDSONTABLE"/>
    <logic-flow v-else-if="editorType === ArticleTypeEnum.LOGIC_FLOW"
                v-model="content" :read-only="preview" :article-id="articleIndex.id"/>
    <super-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                  v-else-if="editorType === ArticleTypeEnum.SUPER_EDITOR"/>
    <encrypt-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                    v-else-if="editorType === ArticleTypeEnum.ENCRYPT_EDITOR"/>
    <memo-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                 v-else-if="editorType === ArticleTypeEnum.MEMO"/>
    <ai-chat-editor v-model="content" :read-only="preview" :article-id="articleIndex.id"
                    v-else-if="editorType === ArticleTypeEnum.AI_CHAT"/>
    <empty-result v-else title="未知的文件类型" tip="请联系管理员反馈"/>
  </div>
</template>
<script lang="ts" setup>
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
// 编辑器
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import MonacoEditor from "@/editor/MonacoEditor/MonacoEditor.vue";
import MarkdownEditor from "@/editor/MarkdownEditor/index.vue";
import ExcelEditor from "@/editor/ExcelEditor/index.vue";
import MindMapEditor from "@/editor/MindMapEditor/index.vue";
import DrauuEditor from "@/editor/DrauuEditor/index.vue";
import HandsontableEditor from "@/editor/HandsontableEditor/index.vue";
import LogicFlow from "@/editor/LogicFlow/LogicFlow.vue";
import SuperEditor from "@/editor/SuperEditor/SuperEditor.vue";
import EncryptEditor from "@/editor/EncryptEditor/EncryptEditor.vue";
import MemoEditor from "@/editor/MemoEditor/MemoEditor.vue";
import AiChatEditor from "@/editor/AiChatEditor/AiChatEditor.vue";

import {ArticleIndex} from "@/entity/article";
import {parseFileExtra} from "@/utils/file/FileUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticlePreviewEvent, useArticleStore, useBaseSettingStore, useHomeEditorStore} from "@/store";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {useMountEventBus} from "@/hooks/MountEventBus";

const props = defineProps({
  articleIndex: Object as PropType<ArticleIndex>,
});
const emits = defineEmits(['sendToChat']);
defineExpose({insertToArticle});

const load = ref(false);
// 笔记内容，不一定是文本
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
    console.debug("自动保存笔记，但未加载完成")
    return;
  }
  saveContent(value).then(() => console.debug("自动保存笔记成功"))
    .catch(e => MessageUtil.error("自动保存笔记失败", e));
}, {deep: true});


async function initArticle(articleId: number) {
  if (articleId == 0) {
    return;
  }
  const {getContent} = useArticleStore();
  // 内容
  const contentWrap = await getContent(articleId);
  if (!contentWrap.record) {
    MessageUtil.error(`笔记【${articleId}】未找到，请刷新后重试！`);
    return;
  }
  content.value = contentWrap.record.content;
  load.value = true;
  contentRev = contentWrap.rev;

}

onMounted(() => {
  if (!props.articleIndex) {
    return;
  }
  initArticle(props.articleIndex.id);
});

useMountEventBus(useArticlePreviewEvent, onPreview);

function onPreview(id: number) {
  if (props.articleIndex) {
    if (props.articleIndex.id === id) {
      preview.value = !preview.value;
      // 此处处理
      useArticleStore().updateIndex(id, {preview: preview.value})
        .then(res => {
          useHomeEditorStore().update(id, res);
          console.debug("自动更新笔记预览状态");
        })
        .catch(e => MessageUtil.error("自动更新笔记预览状态失败", e));
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

</style>
