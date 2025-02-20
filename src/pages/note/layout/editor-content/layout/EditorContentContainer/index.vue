<template>
  <a-layout class="ec-container">
      <editor-content-editor :article-index="articleIndex" ref="editorRef"/>
  </a-layout>
</template>
<script lang="ts" setup>
import {ArticleIndex} from "@/entity/article";
import EditorContentEditor
  from "@/pages/note/layout/editor-content/layout/EditorContentContainer/EditorContentEditor.vue";

const props = defineProps({
  articleIndex: Object as PropType<ArticleIndex>
});

</script>
<style scoped>
.ec-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
