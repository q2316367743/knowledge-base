<template>
  <div class="memo-preview w-full h-full">
    <div class="w-full h-full flex ">
      <div class="h-full w-full" style="background-color: var(--td-bg-color-container)">
        <memo-preview-content :cards/>
      </div>
      <div class=" memo-preview__aside">
        <div><t-statistic title="未学习数" :value="not" unit="个"/></div>
        <div><t-statistic title="学习中" :value="ing" unit="个"/></div>
        <div><t-statistic title="已学会" :value="ready" unit="个"/></div>
        <t-divider align="center">操作</t-divider>
        <t-button :block="true" theme="primary" class="mt-8px">开始学习</t-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard, MemoDataCardType, MemoDataCardStatusEnum} from "@/editor/MemoEditor/types";
import MemoPreviewContent from "@/editor/MemoEditor/layout/MemoPreview/MemoPreviewContent.vue";

const props = defineProps({
  cards: {
    type: Object as PropType<Array<MemoDataCard<MemoDataCardType>>>,
    default: () => ([])
  }
});

const not = computed(() => props.cards.filter(e => e.status === MemoDataCardStatusEnum.UNKNOWN).length);
const ready = computed(() => props.cards.filter(e => e.status === MemoDataCardStatusEnum.REMEMBERED).length);
const ing = computed(() => props.cards.length - not.value - ready.value);

</script>
<style scoped lang="less">
.memo-preview {
  &__aside {
    width: 184px;
    height: calc(100% - 16px);
    padding: 8px;
    border-left: 1px solid var(--td-border-level-2-color);
  }
}
</style>
