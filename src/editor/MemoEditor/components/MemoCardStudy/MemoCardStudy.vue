<template>
  <div class="memo-card-study" v-if="card">
    <div class="memo-card-study__star">
      <t-tag theme="primary">{{ renderMemoDataCardType(card.type) }}</t-tag>
      <t-button theme="primary" variant="outline" @click="answer = !answer" v-show="showAnswerBtn">
        显示答案
      </t-button>
    </div>
    <div class="memo-card-study__container">
      <memo-card-study-for-text v-if="card.type === 'TEXT'" :card="card as MemoDataCard<'TEXT'>" :answer/>
      <memo-card-study-for-choice v-else-if="card.type === 'CHOICE'" :card="card as MemoDataCard<'CHOICE'>" :answer/>
      <memo-card-study-for-word v-else-if="card.type === 'WORD'" :card="card as MemoDataCard<'WORD'>" :answer/>
      <memo-card-study-for-blank v-else-if="card.type === 'BLANK'" :card="card as MemoDataCard<'BLANK'>" :answer/>
      <memo-card-study-for-image v-else-if="card.type === 'IMAGE'" :card="card as MemoDataCard<'IMAGE'>" :answer/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  MemoDataCard,
  MemoDataCardType,
  renderMemoDataCardType
} from "@/editor/MemoEditor/types";
import MemoCardStudyForText from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyForText.vue";
import MemoCardStudyForChoice from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyForChoice.vue";
import MemoCardStudyForWord from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyForWord.vue";
import MemoCardStudyForBlank from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyForBlank.vue";
import MemoCardStudyForImage from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyForImage.vue";

const props = defineProps({
  card: {
    type: Object as PropType<MemoDataCard<MemoDataCardType>>,
  },
});

const answer = ref(false);

const showAnswerBtn = computed(() => {
  return props.card?.type !== "IMAGE" && props.card?.type !== "BLANK";
})
</script>
<style scoped lang="less">
.memo-card-study {
  width: 100%;
  height: 100%;
  border-radius: var(--td-radius-large);
  box-shadow: var(--td-shadow-1);
  background-color: var(--td-bg-color-container);
  position: relative;

  .memo-card-study__star {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .memo-card-study__container {
    position: absolute;
    top: 64px;
    left: 16px;
    right: 16px;
    bottom: 16px;
    overflow: auto;
  }
}
</style>
