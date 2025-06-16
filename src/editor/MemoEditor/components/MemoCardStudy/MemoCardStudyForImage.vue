<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <t-image :src="card.data.url" :style="{width: '100%', height: '100%'}" fit="cover" lazy/>
    <template v-if="card.data.analysis && answer">
      <t-divider align="left">解析</t-divider>
      <div>{{ card.data.analysis }}</div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'IMAGE'>>,
  },
  answer: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped lang="less">
.memo-card-preview-for-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
