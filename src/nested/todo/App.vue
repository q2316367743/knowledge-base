<template>
  <div class="todo-app">
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <main-for-todo :todo-id="targetId" v-if="targetId > 0"/>
  </div>
</template>

<script lang="ts" setup>
import {themeColor} from "@/store";
import MainForTodo from "@/nested/todo/components/MainForTodo.vue";

const targetId = ref(0);

function onInit(id: number) {
  targetId.value = id;
}

// 子窗口通信
const subWindow = window.preload.ipcRenderer.buildSubWindow('todo:to');
subWindow.receiveMsg(msg => {
  const {event, data} = msg;
  if (event === '/todo/init/id') {
    onInit(data.id);
  }
});

// 兼容web调试
const queryString = location.search;
const params = new URLSearchParams(queryString);
const todoId = params.get("todo-id");
if (todoId) {
  const id = parseInt(todoId);
  if (id) {
    onInit(id);
  }
}
</script>

<style scoped lang="less">
.todo-app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
