<template>
  <splitpanes class="default-theme todo-content-default">
    <pane :size="30" class="relative">
      <content-default-side/>
    </pane>
    <pane :size="70" class="relative">
      <div class="info">
        <empty-result v-if="itemId === 0" title="未选择待办项" tip="请选择待办项"/>
        <loading-result title="正在加载中" v-else-if="!show && itemId > 0"/>
        <content-default-main v-else-if="show"/>
      </div>
    </pane>
  </splitpanes>
</template>
<script lang="ts" setup>
import {Splitpanes, Pane} from 'splitpanes'
import './index.less';
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentDefaultMain from "@/pages/todo/ContentDefault/ContentDefaultMain/index.vue";
import ContentDefaultSide from "@/pages/todo/ContentDefault/ContentListSide/ContentDefaultSide.vue";

const show = ref(true);

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
