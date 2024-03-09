<template>
    <a-layout class="todo">
        <a-layout-sider :width="270" :collapsed-width="0" :collapsed="collapsed">
            <todo-side v-show="!collapsed"/>
        </a-layout-sider>
        <a-layout-content>
            <a-result title="请在左侧选择清单" status="404" style="margin-top: 20vh" v-if="empty"/>
            <todo-content v-else-if="!empty && layout === TodoListLayoutEnum.DEFAULT"/>
            <content-card v-else-if="!empty && layout === TodoListLayoutEnum.CARD" />
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";

import TodoSide from "@/pages/todo/components/TodoSide/index.vue";
import TodoContent from "@/pages/todo/components/todo-content/index.vue";
import ContentCard from "@/pages/todo/components/ContentCard/index.vue";

const collapsed = computed(() => useTodoStore().collapsed);
const layout = computed(() => useTodoStore().layout);
const empty = computed(() => useTodoStore().id === 0);

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
