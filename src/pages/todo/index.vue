<template>
    <a-layout class="todo">
        <a-layout-sider :width="270" :collapsed-width="0" :collapsed="collapsed">
            <todo-side />
        </a-layout-sider>
        <a-layout-content>
            <todo-content />
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import TodoSide from "@/pages/todo/components/todo-side.vue";
import TodoContent from "@/pages/todo/components/todo-content/index.vue";
import {computed} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";

const collapsed = computed(() => useTodoStore().collapsed)

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
