<template>
  <div class="list-side-priority">
    <list-side-top :items="list.top"/>
    <list-side-priority-item v-for="item in list.priorities" :key="item.value" :priority="item"/>
    <list-side-complete :groups="list.self" v-if="!hideOfCompleteOrAbandon"/>
  </div>
</template>
<script lang="ts" setup>
import {group} from "@/utils/lang/ArrayUtil";
import {TodoGroupPriorityView, TodoGroupView} from "@/entity/todo/TodoGroup";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {handlePriorityText, TodoItemIndex} from "@/entity/todo/TodoItem";
import ListSidePriorityItem
  from "@/pages/todo/ContentDefault/ContentListSide/ListSidePriority/ListSidePriorityItem.vue";
import ListSideComplete
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideComplete.vue";
import ListSideTop from "@/pages/todo/ContentDefault/components/ListSideTop.vue";

const list = computed<{
  priorities: Array<TodoGroupPriorityView>,
  self: Array<TodoGroupView>,
  top: Array<TodoItemIndex>
}>(() => {
  const {todoGroupView} = useTodoWrapStore();
  const priorityMap = group(todoGroupView.flatMap(e => e.children), 'value');
  const priorities = new Array<TodoGroupPriorityView>();
  priorityMap.forEach((v, k) => priorities.push({
    value: k,
    label: handlePriorityText(k),
    children: v.flatMap(e => e.children),
  }));

  return {priorities, self: todoGroupView, top: todoGroupView.flatMap(e => e.top)};
});
const hideOfArticle = computed(() => useTodoWrapStore().hideOfArticle);
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);
</script>
<style scoped lang="less">

</style>
