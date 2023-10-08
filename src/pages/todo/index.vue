<template>
    <a-layout class="todo">
        <a-layout-sider :width="250" :collapsed-width="0">
            <todo-side />
        </a-layout-sider>
        <a-layout-content>待办</a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import TodoSide from "@/pages/todo/components/todo-side.vue";
</script>
<style scoped>
.todo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
