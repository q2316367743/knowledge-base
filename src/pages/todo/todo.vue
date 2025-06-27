<template>
  <div class="todo">
    <div class="todo-layout-side" :style="{width: collapsed ? '0px' : '270px'}">
      <todo-side/>
    </div>
    <t-content class="todo-layout-content">
      <empty-todo v-if="loading">
        <loading-result title="正在初始化清单"/>
      </empty-todo>
      <empty-todo v-else-if="isWidget">
        <info-result title="当前清单正在使用小部件" tip="请在小部件中使用"/>
      </empty-todo>
      <empty-todo v-else-if="empty">
        <empty-result title="未选择清单" tip="请在左侧选择清单"/>
      </empty-todo>
      <content-default v-else-if="!empty && layout === TodoListLayoutEnum.DEFAULT"/>
      <content-card v-else-if="!empty && layout === TodoListLayoutEnum.CARD"/>
      <content-calendar v-else-if="!empty && layout === TodoListLayoutEnum.CALENDAR"/>
      <content-four-quadrants v-else-if="!empty && layout === TodoListLayoutEnum.FOUR_QUADRANTS"/>
    </t-content>
    <div :style="{width: itemId === 0 ? '0px' : '40vw', minWidth: itemId === 0 ? '0px': '500px'}"
         class="todo-layout-aside">
      <loading-result title="正在加载中" v-if="!show && itemId > 0"/>
      <todo-info v-else-if="show"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoWidgetStore} from "@/store/components/TodoWidgetStore";

import TodoSide from "@/pages/todo/common/TodoSide/TodoSide.vue";
import ContentDefault from "@/pages/todo/ContentDefault/index.vue";
import ContentCard from "@/pages/todo/ContentCard/index.vue";
import ContentCalendar from "@/pages/todo/ContentCalendar/index.vue";
import ContentFourQuadrants from "@/pages/todo/ContentFourQuadrants/index.vue";
import EmptyTodo from "@/pages/todo/common/EmptyTodo.vue";
import TodoInfo from "@/pages/todo/common/TodoInfo/TodoInfo.vue";

const collapsed = computed(() => useTodoWrapStore().collapsed);
const layout = computed(() => useTodoWrapStore().layout);
const loading = computed(() => useTodoWrapStore().loading);
const empty = computed(() => useTodoWrapStore().categoryId === 0);

const isWidget = computed(() => {
  const {todoIds} = useTodoWidgetStore();
  const {categoryId} = useTodoWrapStore();
  return todoIds.has(categoryId);
});

// 每次进来都检查一下窗口
useTodoWidgetStore().checkWidget();


const show = ref(true);

const itemId = computed(() => useTodoWrapStore().itemId);

watch(() => itemId.value, value => {
  if (value > 0) {
    show.value = false;
    nextTick(() => show.value = true);
  }
}, {immediate: true})
</script>
<style scoped>
.todo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  flex-direction: row;
  display: flex;
  background: var(--td-bg-color-page);
  font: var(--td-font-body-medium);
  color: var(--td-text-color-primary);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;

  .todo-layout-side, .todo-layout-aside {
    position: relative;
    transition: all 0.2s;
    background: var(--td-bg-color-container);
    width: 232px;
    overflow: hidden;
  }


  @media screen and (max-width: 950px) {
    .todo-layout-aside {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      box-shadow: var(--td-shadow-2);
    }
  }

  .todo-layout-content {
    position: relative;
    flex: auto;
    border-left: 1px solid var(--td-border-level-2-color);
  }
}
</style>
