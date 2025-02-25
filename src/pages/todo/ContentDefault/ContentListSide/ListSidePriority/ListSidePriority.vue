<template>
  <div class="list-side-priority">
    <list-side-priority-item v-for="item in list.priorities" :key="item.value" :priority="item"/>
    <list-side-complete :groups="list.self" v-if="!hideOfCompleteOrAbandon"/>
    <list-side-article v-if="!hideOfArticle"/>
  </div>
</template>
<script lang="ts" setup>
import {group} from "@/utils/lang/ArrayUtil";
import {TodoGroupPriorityView, TodoGroupView} from "@/entity/todo/TodoGroup";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {handlePriorityText} from "@/entity/todo/TodoItem";
import ListSidePriorityItem
  from "@/pages/todo/ContentDefault/ContentListSide/ListSidePriority/ListSidePriorityItem.vue";
import ListSideComplete
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideComplete.vue";
import ListSideArticle
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideArticle.vue";

const list = computed<{ priorities: Array<TodoGroupPriorityView>, self: Array<TodoGroupView> }>(() => {
  const {todoGroupView} = useTodoWrapStore();
  const priorityMap = group(todoGroupView.flatMap(e => e.children), 'value');
  const priorities = new Array<TodoGroupPriorityView>();
  priorityMap.forEach((v, k) => {
    priorities.push({
      value: k,
      label: handlePriorityText(k),
      children: v.flatMap(e => e.children),
    });
  });

  return {priorities, self: todoGroupView};
});
const hideOfArticle = computed(() => useTodoWrapStore().hideOfArticle);
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);
</script>
<style scoped lang="less">

</style>
