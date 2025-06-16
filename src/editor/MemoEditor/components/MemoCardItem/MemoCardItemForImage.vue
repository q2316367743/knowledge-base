<template>
  <div class="memo-card-item-for-text" v-if="card">
    <div class="memo-card-item-for-text__content">
      <t-image :src="card.data.url" fit="cover" style="width: 100%;margin: auto 0;" lazy/>
    </div>
    <div class="memo-card-item-for-text__footer">
      <div class="date">{{ card.createDate }}</div>
      <t-tag theme="primary" size="small">空白卡</t-tag>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'IMAGE'>>,
  }
});
</script>
<style scoped lang="less">
@import "@/assets/style/func";

.memo-card-item-for-text {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-placeholder);
    flex: 1 1 auto;
    overflow: auto;
    margin-bottom: 8px;
    word-wrap: anywhere;
    .ellipsis-line(@line-number: 8);
    display: flex;
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
