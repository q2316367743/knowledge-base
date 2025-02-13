<template>
  <div class="monaco-editor">
    <MonacoEditorCore v-model="content" :language :read-only="readOnly" :article-id="articleId" @change="emit('change')"
                      @editor-mounted="emit('editor-mounted')"/>
  </div>
</template>
<script lang="ts" setup>
import MonacoEditorCore from "@/editor/MonacoEditor/MonacoEditorCore.vue";

const content = defineModel({
  type: String,
  default: ''
});
defineProps({
  language: {
    type: String as PropType<string>,
    default: 'javascript',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  articleId: Number,
  fileName: String
});
const emit = defineEmits(['change', 'editor-mounted']);
</script>
<style scoped lang="less">
.monaco-editor {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
