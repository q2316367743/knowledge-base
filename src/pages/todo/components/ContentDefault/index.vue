<template>
  <a-split class="todo-content-default" default-size="300px" min="220px" :max="max">
    <template #first>
      <content-default-side/>
    </template>
    <template #second>
      <div class="info">
        <a-result v-if="itemId === 0" status="404" title="请选择待办项"/>
        <a-result status="info" title="正在加载中" v-else-if="!show && itemId > 0">
          <template #icon>
            <icon-loading spin/>
          </template>
        </a-result>
        <content-default-main v-else-if="show"/>
      </div>
    </template>
  </a-split>
</template>
<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import ContentDefaultMain from "@/pages/todo/components/ContentDefault/layout/ContentDefaultMain/index.vue";
import ContentDefaultSide from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/index.vue";
import {useTodoStore} from "@/store/components/TodoStore";
import './index.less';

const size = useWindowSize();
const show = ref(true);

const max = computed(() => (size.width.value - 200) + 'px');
const itemId = computed(() => useTodoStore().itemId);

watch(() => itemId.value, value => {
  if (value > 0) {
    show.value = false;
    nextTick(() => show.value = true);
  }
}, {immediate: true})


</script>
<style lang="less">
</style>
