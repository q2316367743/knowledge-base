<template>
  <div class="memo-card-item-for-text" v-if="card">
    <div class="memo-card-item-for-text__title ellipsis">{{ card.data.word }}</div>
    <div class="memo-card-item-for-text__content">
      <div class="meaning">
        <div v-for="e in card.data.meaning">{{ e.partOfSpeech }} {{ e.translation }}</div>
      </div>
      <t-divider v-if="card.data.examples && card.data.examples.length > 0"/>
      <div class="examples" v-if="card.data.examples && card.data.examples.length > 0">
        <div class="example" v-for="e in card.data.examples">{{ e.sentence }} {{ e.translation }}</div>
      </div>
    </div>
    <div class="memo-card-item-for-text__footer">
      <div class="date">{{ card.createDate }}</div>
      <t-tag theme="primary" size="small">单词卡</t-tag>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'WORD'>>,
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

    .example {
      padding: 8px;
      border: 1px solid var(--td-border-level-2-color);
      border-radius: var(--td-radius-default);
    }
  }

  &__footer {
    font-size: var(--td-font-size-body-small);
    color: var(--td-text-color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .date {
      transition: color 0.3s ease-in-out;
      cursor: pointer;

      &:hover {
        color: var(--td-text-color-link);
      }
    }
  }
}
</style>
