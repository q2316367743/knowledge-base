<template>
  <t-layout class="todo">
    <t-aside :width="collapsed ? '0px' : '270px'" class="overflow-hidden">
      <todo-side/>
    </t-aside>
    <t-content style="position: relative;background-color: var(--td-bg-color-container)">
      <loading-result v-if="loading" title="正在初始化清单"/>
      <empty-result v-else-if="empty" title="未选择清单" tip="请在左侧选择清单"/>
      <content-default v-else-if="!empty && layout === TodoListLayoutEnum.DEFAULT"/>
      <content-card v-else-if="!empty && layout === TodoListLayoutEnum.CARD"/>
      <content-calendar v-else-if="!empty && layout === TodoListLayoutEnum.CALENDAR"/>
      <content-four-quadrants v-else-if="!empty && layout === TodoListLayoutEnum.FOUR_QUADRANTS"/>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

import TodoSide from "@/pages/todo/TodoSide/index.vue";
import ContentDefault from "@/pages/todo/ContentDefault/index.vue";
import ContentCard from "@/pages/todo/ContentCard/index.vue";
import ContentCalendar from "@/pages/todo/ContentCalendar/index.vue";
import ContentFourQuadrants from "@/pages/todo/ContentFourQuadrants/index.vue";

const collapsed = computed(() => useTodoWrapStore().collapsed);
const layout = computed(() => useTodoWrapStore().layout);
const loading = computed(() => useTodoWrapStore().loading);
const empty = computed(() => useTodoWrapStore().categoryId === 0);

</script>
<style scoped>
.todo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
