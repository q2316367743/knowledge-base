<template>
  <div class="memo-preview w-full h-full">
    <div class="w-full h-full flex ">
      <div class="h-full w-full" style="background-color: var(--td-bg-color-container)">
        <memo-preview-content :cards="data" v-if="data.length > 0"/>
        <success-result v-else title="已完成今日的全部学习内容"/>
      </div>
      <div class="memo-preview__aside">
        <div class="memo-preview__statistics">
          <t-statistic title="未学习" :value="not" unit="个"/>
          <t-statistic title="学习中" :value="ing" unit="个"/>
          <t-statistic title="已学会" :value="ready" unit="个"/>
        </div>
        <t-divider align="center">操作</t-divider>
        <t-space direction="vertical" class="w-full" size="small">
          <t-button :block="true" theme="primary" :disabled="ing === 0" @click="onStudy">开始复习</t-button>
          <t-button :block="true" theme="primary" :disabled="ready === 0" @click="onReview">温故知新</t-button>
          <t-button :block="true" theme="primary">自定义学习</t-button>
        </t-space>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  MemoDataCard,
  MemoDataCardType,
  MemoDataCardStatusEnum,
  IMemoInstance,
  MemoInstance
} from "@/editor/MemoEditor/types";
import MemoPreviewContent from "@/editor/MemoEditor/layout/MemoPreview/MemoPreviewContent.vue";
import {openMemoCardStudy} from "@/editor/MemoEditor/components/MemoCardStudy/MemoCardStudyDrawer";

const props = defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => ([])
  }
});
const instance = inject<IMemoInstance>(MemoInstance);

const not = computed(() => props.cards.filter(e => e.status === MemoDataCardStatusEnum.UNKNOWN).length);
const ready = computed(() => props.cards.filter(e => e.status === MemoDataCardStatusEnum.COMPLETED).length);
const ing = computed(() => props.cards.length - not.value - ready.value);

const data = computed(() => {
  const now = Date.now();
  return props.cards.filter(e => {
    if (e.status === MemoDataCardStatusEnum.UNKNOWN) {
      // 未学习
      return true;
    } else if (e.status === MemoDataCardStatusEnum.REMEMBERED) {
      // 记住了，看看最后时间是否超过12小时
      return now - e.lastLearnedAt > 12 * 60 * 60 * 1000;
    } else if (e.status === MemoDataCardStatusEnum.BLUR) {
      // 模糊，看看最后时间是否超过7.2小时
      return now - e.lastLearnedAt > 7.2 * 60 * 60 * 1000;
    } else if (e.status === MemoDataCardStatusEnum.NOT_REMEMBERED) {
      // 不记得，看看时间是否超过3.6小时
      return now - e.lastLearnedAt > 3.6 * 60 * 60 * 1000;
    }
    // 完成学习，不需要
    return false;
  })
})

const onStudy = () => {
  if (!instance) return;
  openMemoCardStudy(props.cards.filter(e => e.status !== MemoDataCardStatusEnum.COMPLETED && e.status !== MemoDataCardStatusEnum.UNKNOWN), instance);
}
// 复习
const onReview = () => {
  if (!instance) return;
  openMemoCardStudy(props.cards.filter(e => e.status === MemoDataCardStatusEnum.COMPLETED), instance);
}
</script>
<style scoped lang="less">
.memo-preview {
  &__aside {
    width: 240px;
    height: calc(100% - 16px);
    padding: 8px;
    border-left: 1px solid var(--td-border-level-2-color);
    overflow: auto;
  }

  &__statistics {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: flex-start;
    align-content: flex-start;
  }
}
</style>
