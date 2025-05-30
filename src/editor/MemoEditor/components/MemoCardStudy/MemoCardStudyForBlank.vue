<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <div class="memo-card-preview-for-text__content" v-if="answer">{{ card.data.answer }}</div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'BLANK'>>,
  },
  answer: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped lang="less">
.memo-card-preview-for-text {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-primary);
    flex: 1 1 auto;
    overflow: auto;
    margin-bottom: 8px;
    word-wrap: anywhere;
    white-space: pre-wrap;
    word-break: break-all;
  }

}
</style>
