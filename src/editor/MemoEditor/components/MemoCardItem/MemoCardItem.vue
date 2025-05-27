<template>
  <div class="memo-card-item" v-if="card">
    <memo-card-item-for-text v-if="card.type === 'TEXT'" :card="card as MemoDataCard<'TEXT'>"/>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard, MemoDataCardType} from "@/editor/MemoEditor/types";
import MemoCardItemForText from "@/editor/MemoEditor/components/MemoCardItem/MemoCardItemForText.vue";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<MemoDataCardType>>,
  }
})
</script>
<style scoped lang="less">
.memo-card-item {
  border-radius: var(--td-radius-medium);
  box-shadow: var(--td-shadow-3);
  background-color: var(--td-bg-color-component);
  transition: background-color 0.3s ease-in-out;
  padding: 16px;
  height: 200px;
  width: 200px;

  &:hover {
    background-color: var(--td-bg-color-component-hover);
  }
}
</style>
