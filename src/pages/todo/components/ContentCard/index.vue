<template>
  <div class="todo-content-card">
    <todo-header/>
    <content-card-main/>
  </div>
</template>
<script lang="ts" setup>
import TodoHeader from "@/pages/todo/components/common/TodoHeader.vue";
import ContentCardMain from "@/pages/todo/components/ContentCard/components/ContentCardMain.vue";
</script>
<style scoped lang="less">
.todo-content-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-fill-1);
}
</style>
