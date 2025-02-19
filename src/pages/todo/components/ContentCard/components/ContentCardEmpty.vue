<template>
  <div class="content-card-empty">
    <a-button type="outline" long @click="openEditTodoGroupFunc()">
      添加分组
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import {openEditTodoGroupFunc} from "@/pages/todo/components/func/TodoGroupFunc";
</script>
<style scoped lang="less">
.content-card-empty{
  width: 256px;
  height: calc(100vh - 40px);
  padding: 16px 8px;
}
</style>
