<template>
  <a-split class="todo-content-default" default-size="300px" min="220px" :max="max">
    <template #first>
      <content-default-side/>
    </template>
    <template #second>
      <div class="info">
        <empty-result v-if="itemId === 0" title="未选择待办项" tip="请选择待办项"/>
        <loading-result title="正在加载中" v-else-if="!show && itemId > 0"/>
        <content-default-main v-else-if="show"/>
      </div>
    </template>
  </a-split>
</template>
<script lang="ts" setup>
import './index.less';
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentDefaultMain from "@/pages/todo/ContentDefault/ContentDefaultMain/index.vue";
import ContentDefaultSide from "@/pages/todo/ContentDefault/ContentListSide/ContentDefaultSide.vue";

const size = useWindowSize();
const show = ref(true);

const max = computed(() => (size.width.value - 200) + 'px');
const itemId = computed(() => useTodoWrapStore().itemId);

watch(() => itemId.value, value => {
  if (value > 0) {
    show.value = false;
    nextTick(() => show.value = true);
  }
}, {immediate: true})


</script>
<style lang="less">
</style>
