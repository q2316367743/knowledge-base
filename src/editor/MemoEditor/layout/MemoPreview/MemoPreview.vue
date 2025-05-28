<template>
  <div class="memo-preview w-full h-full">
    <div class="w-full h-full flex ">
      <div class="h-full w-full" style="background-color: var(--td-bg-color-container)">
        <memo-preview-content :cards/>
      </div>
      <div class="h-full w-200px memo-preview__aside">
        侧边栏
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import MemoPreviewContent from "@/editor/MemoEditor/layout/MemoPreview/MemoPreviewContent.vue";

defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => []
  }
});

</script>
<style scoped lang="less">
.memo-preview {
  &__aside {
    border-left: 1px solid var(--td-border-level-2-color);
  }
}
</style>
