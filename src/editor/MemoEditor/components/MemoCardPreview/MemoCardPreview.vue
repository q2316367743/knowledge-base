<template>
  <div class="memo-card-preview" v-if="card">
    <div class="memo-card-preview__star">
      <t-tag theme="primary">{{ renderMemoDataCardType(card.type) }}</t-tag>
      <t-button theme="primary" variant="outline" shape="square" @click="onStar(idx)">
        <template #icon>
          <star-filled-icon v-if="card.star"/>
          <star-icon v-else/>
        </template>
      </t-button>
    </div>
    <div class="memo-card-preview__container">
      <memo-card-preview-for-text v-if="card.type === 'TEXT'" :card="card as MemoDataCard<'TEXT'>"/>
      <memo-card-preview-for-choice v-else-if="card.type === 'CHOICE'" :card="card as MemoDataCard<'CHOICE'>"/>
      <memo-card-preview-for-word v-else-if="card.type === 'WORD'" :card="card as MemoDataCard<'WORD'>"/>
      <memo-card-preview-for-blank v-else-if="card.type === 'BLANK'" :card="card as MemoDataCard<'BLANK'>"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  IMemoInstance,
  MemoDataCard,
  MemoDataCardType,
  MemoInstance,
  renderMemoDataCardType
} from "@/editor/MemoEditor/types";
import {StarFilledIcon, StarIcon} from "tdesign-icons-vue-next";
import MemoCardPreviewForText from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreviewForText.vue";
import MemoCardPreviewForChoice from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreviewForChoice.vue";
import MemoCardPreviewForWord from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreviewForWord.vue";
import MemoCardPreviewForBlank from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreviewForBlank.vue";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<MemoDataCardType>>,
  },
  idx: {
    type: Number,
    required: true,
    default: 0,
  }
});


const instance = inject<IMemoInstance>(MemoInstance);

const onStar = (idx: number) => {
  instance?.onStar(idx);
}
</script>
<style scoped lang="less">
.memo-card-preview {
  width: 100%;
  height: 100%;
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-1);
  background-color: var(--td-bg-color-container);
  position: relative;

  .memo-card-preview__star {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .memo-card-preview__container {
    position: absolute;
    top: 64px;
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
</style>
