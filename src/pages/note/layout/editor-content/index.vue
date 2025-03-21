<template>
  <div class="he-editor">
    <div class="he-editor__header">
      <editor-content-header/>
    </div>
    <div class="he-editor__body">
      <editor-content-editor v-for="article in homeEditorArticles" :key="article.id" :article-index="article"
                             v-show="article.id === homeEditorId"/>
      <not-note status="404" v-if="homeEditorArticles.length === 0"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {homeEditorArticles, homeEditorId} from "@/store/components/HomeEditorStore";
import EditorContentHeader from "@/pages/note/layout/editor-content/layout/EditorContentHeader/index.vue";
import NotNote from "@/pages/note/components/NotNote.vue";
import EditorContentEditor
  from "@/pages/note/layout/editor-content/layout/EditorContentEditor/EditorContentEditor.vue";
</script>
<style lang="less" scoped>
.he-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;

  .he-editor__header {

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--td-bg-color-container);
  }

  .he-editor__body {
    position: absolute;
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 3;
  }

}
</style>
