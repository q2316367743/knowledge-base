<template>
  <div class="memo-card-item-for-text" v-if="card">
    <div class="memo-card-item-for-text__title ellipsis">{{ card.data.question }}</div>
    <div class="memo-card-item-for-text__content">
      <div v-for="(o, i) in card.data.options" :class="{check: o.value}">{{ getNo(i) }}. {{ o.label }}</div>
    </div>
    <div class="memo-card-item-for-text__footer">
      <div class="date">{{ card.createDate }}</div>
      <t-tag theme="primary" size="small">选择卡</t-tag>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";
import {getNo} from "@/utils/lang/FieldUtil";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'CHOICE'>>,
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
    padding-top: 8px;

    .check {
      color: var(--td-success-color);
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
