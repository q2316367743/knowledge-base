<template>
  <div class="memo-card-preview-for-image" v-if="card">
    <img :src="card.data.url" alt="图片卡" class="w-full"/>
  </div>
</template>
<script lang="ts" setup>
import {MemoDataCard} from "@/editor/MemoEditor/types";

defineProps({
  card: {
    type: Object as PropType<MemoDataCard<'IMAGE'>>,
  }
});
</script>
<style scoped lang="less">
.memo-card-preview-for-image {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
