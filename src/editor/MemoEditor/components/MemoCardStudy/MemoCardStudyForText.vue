<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <div class="memo-card-preview-for-text__title">{{ card.data.question }}</div>
    <div class="memo-card-preview-for-text__content" v-if="answer">{{ card.data.answer }}</div>
    <template v-if="card.data.analysis && answer">
      <t-divider align="left">解析</t-divider>
      <div>{{ card.data.analysis }}</div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'TEXT'>>,
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
  overflow: auto;

  &__title {
    font-size: var(--td-font-size-title-large);
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-placeholder);
    margin-bottom: 8px;
    word-wrap: anywhere;
  }

}
</style>
