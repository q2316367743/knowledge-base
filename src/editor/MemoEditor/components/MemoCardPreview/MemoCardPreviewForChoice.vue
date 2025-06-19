<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <div class="memo-card-preview-for-text__title" v-if="shadow">{{ card.data.question }}</div>
    <div class="memo-card-preview-for-text__content">
      <div v-for="(o, i) in card.data.options" :class="{check: o.value}">{{ getNo(i) }}. {{ o.label }}</div>
    </div>
    <template v-if="card.data.analysis">
      <t-divider align="left">解析</t-divider>
      <markdown-preview :value=" card.data.analysis" />
    </template>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";
import {getNo} from "@/utils/lang/FieldUtil";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'CHOICE'>>,
  },
  shadow: {
    type: Boolean,
    default: true
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
    font-size: var(--td-font-size-title-medium);
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__content {
    font-size: var(--td-font-size-body-medium);
    color: var(--td-text-color-placeholder);
    margin-bottom: 8px;
    word-wrap: anywhere;
    padding-top: 8px;

    .check {
      color: var(--td-success-color);
    }
  }

}
</style>
