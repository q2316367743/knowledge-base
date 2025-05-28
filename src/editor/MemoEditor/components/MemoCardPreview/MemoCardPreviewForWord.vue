<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <div class="memo-card-preview-for-text__title ellipsis">{{ card.data.word }}</div>
    <div class="memo-card-preview-for-text__content">
      <t-divider v-if="card.data.meaning && card.data.meaning.length > 0" align="left">解释</t-divider>
      <div class="meaning">
        <div v-for="e in card.data.meaning">{{ e.partOfSpeech }} {{ e.translation }}</div>
      </div>
      <t-divider v-if="card.data.examples && card.data.examples.length > 0" align="left">例句</t-divider>
      <ul class="examples" v-if="card.data.examples && card.data.examples.length > 0">
        <li v-for="e in card.data.examples" class="example">
          {{ e.sentence }}
          <t-tooltip :content="e.translation">
            <t-tag size="small" theme="success" class="cursor-pointer ml6px">译</t-tag>
          </t-tooltip>
        </li>
      </ul>
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

    .example {
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-radius: var(--td-radius-default);
      width: fit-content;
    }
  }

}
</style>
