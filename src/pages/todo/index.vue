<template>
  <t-layout class="todo">
    <t-aside :width="collapsed ? '0px' : '270px'" class="overflow-hidden">
      <todo-side/>
    </t-aside>
    <t-content style="position: relative;background-color: var(--td-bg-color-container)">
      <a-result title="请在左侧选择清单" status="404" style="margin-top: 20vh" v-if="empty"/>
      <content-default v-else-if="!empty && layout === TodoListLayoutEnum.DEFAULT"/>
      <content-card v-else-if="!empty && layout === TodoListLayoutEnum.CARD"/>
      <content-calendar v-else-if="!empty && layout === TodoListLayoutEnum.CALENDAR"/>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";

import TodoSide from "@/pages/todo/TodoSide/index.vue";
import ContentDefault from "@/pages/todo/ContentDefault/index.vue";
import ContentCard from "@/pages/todo/ContentCard/index.vue";
import ContentCalendar from "@/pages/todo/ContentCalendar/index.vue";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

const collapsed = computed(() => useTodoWrapStore().collapsed);
const layout = computed(() => useTodoWrapStore().layout);
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
