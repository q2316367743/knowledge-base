<template>
  <div class="app kb-preview">
    <link :href="`/theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <editor-content-editor :article-index="target" v-if="target"/>
    <t-image-viewer v-model:visible="preview.visible" :images="[preview.src]"/>
  </div>
</template>
<script lang="ts" setup>
import {themeColor, useArticleStore, useGlobalStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import EditorContentEditor from "@/pages/note/layout/editor-content/layout/EditorContentEditor/EditorContentEditor.vue";

useGlobalStore().initDarkColors();

const title = useTitle();
const target = ref<ArticleIndex>();

const preview = ref({
  visible: false,
  src: ''
})

// @ts-ignore 全局事件
window.onImagePreview = (src: string) => {
  preview.value = {
    visible: true,
    src
  }
}

// @ts-ignore 全局事件
window.jumpToArticle = (title: string) => {
  MessageUtil.warning("关联笔记暂时下线");
}

async function _onInit(id: number) {
  const items = await useArticleStore().init();
  for (const item of items) {
    if (item.id === id) {
      target.value = {
        ...item,
        preview: true
      };
      title.value = item.name;
      return Promise.resolve();
    }
  }
  return Promise.reject(new Error("笔记未找到"));
}


function onInit(id: number) {
  _onInit(id).catch(e => MessageUtil.error("打开笔记失败", e));
}

// 子窗口
const subWindow = window.preload.ipcRenderer.buildSubWindow('preview');
subWindow.receiveMsg(msg => {
  const {id} = msg;
  if (id) {
    onInit(id);
  }
});

// 兼容web调试
const queryString = location.search; // 返回：'?q=123'

// 进一步解析：
const params = new URLSearchParams(queryString);
const articleId = params.get("article-id");
if (articleId) {
  const id = parseInt(articleId); // 是数字 123
  if (id) {
    onInit(id);
  }
}


</script>
<style scoped lang="less">
.kb-preview {
  background-color: var(--td-bg-color-container);
}
</style>
