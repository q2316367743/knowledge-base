<template>
  <div class="encrypt-editor-display ">
    <markdown-editor v-if="type === 'markdown'" v-model="data" :preview="true"/>
    <rich-text-editor v-else-if="type === 'rich-text'" v-model="data" :read-nly="true"/>
    <div v-else class="encrypt-editor-display__text">{{ data }}</div>
  </div>
</template>
<script lang="ts" setup>
import MarkdownEditor from '@/editor/MarkdownEditor/index.vue';
import RichTextEditor from '@/editor/RichTextEditor/index.vue';
</script>
<script lang="ts">
export default defineComponent({
  name: 'EncryptEditorDisplay',
  props: {
    data: {
      type: String
    },
    type: {
      type: String
    }
  }
})
</script>
<style scoped lang="less">
.encrypt-editor-display {
  background-color: var(--td-bg-color-container);
  overflow: auto;
  height: 100%;

  .encrypt-editor-display__text {
    padding: 16px;
    height: calc(100% - 32px);
    white-space: pre-wrap;
    word-break: break-all;
  }

}
</style>
