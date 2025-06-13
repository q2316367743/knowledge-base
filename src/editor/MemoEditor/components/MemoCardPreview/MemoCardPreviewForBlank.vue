<template>
  <div class="memo-card-preview-for-text" v-if="card">
    <markdown-preview :value="card.data.answer" />
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'BLANK'>>,
  }
});
</script>
<style scoped lang="less">
.memo-card-preview-for-text {
  display: flex;
  flex-direction: column;
  height: 100%;

}
</style>
