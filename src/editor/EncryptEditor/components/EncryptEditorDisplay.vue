<template>
  <div class="encrypt-editor-display ">
    {{ data }}
  </div>
</template>
<script lang="ts" setup>
</script>
<script lang="ts">
export default defineComponent({
  name: 'EncryptEditorDisplay',
  props: {
    data: {
      type: String
    }
  }
})
</script>
<style scoped lang="less">
.encrypt-editor-display {
  background-color: var(--td-bg-color-container);
  overflow: auto;
  padding: 16px;
  height: calc(100% - 32px);
  white-space: pre-wrap;
  word-break: break-all;

}
</style>
