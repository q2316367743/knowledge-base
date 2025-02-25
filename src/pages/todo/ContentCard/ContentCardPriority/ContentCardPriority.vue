<template>
  <main class="content-card-priority">
    <card-priority-item v-for="priority in priorities" :key="priority.value" :priority="priority"/>
  </main>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {todoGroupToPriorityView, TodoPriorityView} from "@/entity/todo/TodoGroup";
import CardPriorityItem from "@/pages/todo/ContentCard/ContentCardPriority/CardPriorityItem.vue";

const priorities = computed<Array<TodoPriorityView>>(() => {
  const {todoGroupView} = useTodoWrapStore();
  return todoGroupToPriorityView(todoGroupView);
});
</script>
<style scoped lang="less">
.content-card-priority {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-right: 8px;

  display: grid;
  grid-auto-flow: column; /* 横向排列 */
  grid-auto-columns: 268px; /* 每个子项宽度 */
  gap: 8px; /* 可选间隙 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动 */
}
</style>
