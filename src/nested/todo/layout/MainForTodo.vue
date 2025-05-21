<template>
  <div class="todo-container">
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <loading-result v-if="loading" title="正在初始化待办" />
    <template v-else>
      <app-toolbar />
      <!-- 周视图导航 -->
      <week-navigator/>
      <!-- 待办列表 -->
      <day-of-todo/>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {themeColor} from "@/store";
import {initTodo, loading} from "@/nested/todo/store";
import WeekNavigator from "@/nested/todo/layout/WeekNavigator.vue";
import DayOfTodo from "@/nested/todo/layout/DayOfTodo.vue";
import AppToolbar from "@/nested/todo/layout/AppToolbar.vue";

const props = defineProps({
  todoId: {
    type: Number,
    default: 0
  }
});

// 获取待办项

// 初始加载
onMounted(() => initTodo(props.todoId));

</script>

<style scoped lang="less">
.todo-container {
  display: flex;
  flex-direction: column;
  height: calc(100% - 32px);
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-s);
  transform: translate(0, 0);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--td-comp-margin-m);
}


</style>
