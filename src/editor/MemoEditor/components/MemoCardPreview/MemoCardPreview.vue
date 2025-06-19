<template>
  <div class="memo-card-preview" v-if="card" :class="{shadow:shadow}">
    <div class="memo-card-preview__star" v-if="shadow">
      <t-tag theme="primary">{{ renderMemoDataCardType(card.type) }}</t-tag>
      <t-button theme="primary" variant="outline" shape="square" @click="onStar(card)">
        <template #icon>
          <star-filled-icon v-if="card.star"/>
          <star-icon v-else/>
        </template>
      </t-button>
    </div>
    <div class="memo-card-preview__container">
      <memo-card-preview-for-text v-if="card.type === 'TEXT'" :card="card as MemoDataCard<'TEXT'>" :shadow="shadow"/>
      <memo-card-preview-for-choice v-else-if="card.type === 'CHOICE'" :card="card as MemoDataCard<'CHOICE'>"
                                    :shadow="shadow"/>
      <memo-card-preview-for-word v-else-if="card.type === 'WORD'" :card="card as MemoDataCard<'WORD'>"/>
      <memo-card-preview-for-blank v-else-if="card.type === 'BLANK'" :card="card as MemoDataCard<'BLANK'>"/>
      <memo-card-preview-for-image v-else-if="card.type === 'IMAGE'" :card="card as MemoDataCard<'IMAGE'>"/>
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
import MemoCardPreviewForImage from "@/editor/MemoEditor/components/MemoCardPreview/MemoCardPreviewForImage.vue";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<MemoDataCardType>>,
  },
  idx: {
    type: Number,
    required: true,
    default: 0,
  },
  shadow: {
    type: Boolean,
    default: true
  }
});


const instance = inject<IMemoInstance>(MemoInstance);

const onStar = (card: MemoDataCard<MemoDataCardType>) => {
  instance?.onStar(card.id);
}
</script>
<style scoped lang="less">
.memo-card-preview {
  width: 100%;
  height: 100%;
  border-radius: 0;
  background-color: var(--td-bg-color-container);
  position: relative;
  overflow: auto;

  &.shadow {
    box-shadow: var(--td-shadow-1);
    border-radius: var(--td-radius-large);

    .memo-card-preview__container {
      top: 64px;
      left: 16px;
      right: 16px;
      bottom: 16px;
    }
  }

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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    :deep(.cherry-previewer) {
      padding: 0;
    }
  }
}
</style>
