<template>
  <div class="memo-md-editor">
    <markdown-editor v-model="value" :preview="false" :toc="false"/>
  </div>
</template>
<script lang="ts" setup>
import MarkdownEditor from "@/editor/MarkdownEditor/index.vue";

const value = defineModel<string>({
  default: ''
})
</script>
<style scoped lang="less">
.memo-md-editor {
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--td-radius-default);
  overflow: hidden;
  height: 50vh;
  min-height: 450px;
}
</style>
