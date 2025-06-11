<template>
  <div class="todo-app">
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <app-frame :todo-id="targetId" :todo-name="targetName" :always-on-top="alwaysOnTop"/>
    <main-for-todo :todo-id="targetId" v-if="targetId > 0"/>
  </div>
</template>

<script lang="ts" setup>
import MainForTodo from "@/nested/todo/layout/MainForTodo.vue";
import AppFrame from "@/nested/todo/layout/AppFrame.vue";
import {useGlobalStore} from "@/store";
import {WindowUtil} from "@/utils/utools/WindowUtil";

const targetId = ref(0);
const targetName = ref('');
const alwaysOnTop = ref(false);
const themeColor = computed(() => useGlobalStore().themeColor);

function onInit(id: number, name: string) {
  targetId.value = id;
  targetName.value = name;
}

// 子窗口通信
const subWindow = WindowUtil.buildSubWindow('todo:to');
subWindow.receiveMsg(msg => {
  const {event, data} = msg;
  if (event === '/todo/init/id') {
    onInit(data.id, data.name);
  } else if (event === '/todo/status/alwaysOnTop') {
    alwaysOnTop.value = data.alwaysOnTop;
  }
});

// 兼容web调试
const queryString = location.search;
const params = new URLSearchParams(queryString);
const todoId = params.get("todo-id");
if (todoId) {
  const id = parseInt(todoId);
  if (id) {
    onInit(id, params.get("todo-name") || '');
  }
}
</script>

<style scoped lang="less">
.todo-app {
  width: calc(100vw - 2px);
  height: calc(100vh - 2px);
  margin: 0;
  padding: 0;
  border: 1px solid var(--td-border-level-2-color);
  overflow: hidden;
}
</style>
