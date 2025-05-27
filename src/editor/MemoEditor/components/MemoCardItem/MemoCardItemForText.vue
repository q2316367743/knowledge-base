<template>
  <div class="memo-card-item-for-text" v-if="card">
    <div class="memo-card-item-for-text__title ellipsis">{{ card.data.question }}</div>
    <div class="memo-card-item-for-text__content">{{ card.data.answer }}</div>
    <div class="memo-card-item-for-text__footer">{{ card.createDate }}</div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'TEXT'>>,
  }
});
</script>
<style scoped lang="less">
.memo-card-item-for-text {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__title {
    font-size: var(--td-font-size-title-medium);
    font-weight: bold;
    margin-bottom: 8px;
    flex: 0 0 21px;
  }

  &__content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-placeholder);
    flex: 1 1 auto;
    overflow: auto;
    margin-bottom: 8px;
    word-wrap: anywhere;
  }

  &__footer {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    transition: color 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      color: var(--td-text-color-link);
    }
  }
}
</style>
