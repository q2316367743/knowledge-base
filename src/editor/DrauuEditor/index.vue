<template>
  <div class="drauu-editor">
    <!-- 工具栏 -->
    <div class="drauu-header">
      Drauu 画板将不再使用，请使用新版画板编辑器，当前仅做兼容展示。
    </div>
    <!-- 内容 -->
    <div class="drauu-view-wrap">
      <svg class="drauu-view" ref="target" style="touch-action: none" v-html="modelValue"></svg>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  modelValue: {
    type: String,
    default: "",
    required: false
  },
  readOnly: Boolean,
  articleId: Number
});
</script>
<style lang="less">
.drauu-editor {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .drauu-header {
    font-size: 18px;
    font-weight: bold;
  }

  .drauu-view-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
