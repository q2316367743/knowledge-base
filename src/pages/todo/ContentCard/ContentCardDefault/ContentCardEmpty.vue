<template>
  <div class="content-card-empty">
    <t-button theme="primary" variant="outline" :block="true" @click="openEditTodoGroupFunc()">
      添加分组
    </t-button>
  </div>
</template>
<script lang="ts" setup>
import {openEditTodoGroupFunc} from "@/pages/todo/common/TodoGroupFunc";
</script>
<style scoped lang="less">
.content-card-empty {
  width: 256px;
  height: calc(100vh - 40px);
  padding: 16px 8px;
}
</style>
