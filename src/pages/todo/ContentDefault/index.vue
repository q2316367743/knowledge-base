<template>
  <div class="content-default-wrap">
  <div class="content-default">
    <todo-header show-view/>
    <div class="content-default-container">
      <content-default-side v-if="view === 'list'"/>
      <todo-relation-note v-else-if="view === 'note'"/>
    </div>
  </div>
  </div>
</template>
<script lang="ts" setup>
import './index.less';
import {TodoInstance, TodoInstanceView} from "@/pages/todo/types";
import ContentDefaultSide from "@/pages/todo/ContentDefault/ContentListSide/ContentDefaultSide.vue";
import TodoRelationNote from "@/pages/todo/common/TodoRelationNote/TodoRelationNote.vue";
import TodoHeader from "@/pages/todo/common/TodoHeader/TodoHeader.vue";

const view = ref<TodoInstanceView>('list');

provide(TodoInstance, {
  getView: () => view.value,
  setView: (value: TodoInstanceView) => view.value = value
})
</script>
<style lang="less">
.content-default-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--kb-bg-color-component);
}
.content-default {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  height: 100vh;
  background-color: var(--td-bg-color-container);
  .content-default-container {
    position: absolute;
    top: 54px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
}
</style>
