<template>
  <div class="memo-editor">
    <memo-preview v-if="readOnly"/>
    <memo-edit v-else :cards="content.cards"/>
  </div>
</template>
<script lang="ts" setup>
import {MemoData} from "@/editor/MemoEditor/types";
import MemoPreview from "@/editor/MemoEditor/layout/MemoPreview/MemoPreview.vue";
import MemoEdit from "@/editor/MemoEditor/layout/MemoEdit/MemoEdit.vue";

const content = defineModel<MemoData>({
  default: {}
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false,
  },
  articleId: Number,
});
</script>
<style scoped lang="less">
.memo-editor {
  width: 100%;
  height: 100%;
}
</style>
