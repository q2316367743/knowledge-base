<template>
  <a-split class="todo-content-default" default-size="300px" min="220px" :max="max">
    <template #first>
      <content-default-side/>
    </template>
    <template #second>
      <div class="info">
        <t-empty v-if="itemId === 0" type="empty" title="请选择待办项"/>
        <t-empty type="maintenance" title="正在加载中" v-else-if="!show && itemId > 0">
          <template #image>
            <icon-loading spin/>
          </template>
        </t-empty>
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
