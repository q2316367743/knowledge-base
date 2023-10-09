<template>
    <a-split class="todo-layout-list" default-size="300px" min="220px" :max="max">
        <template #first>
            <todo-item-side/>
        </template>
        <template #second>
            <div class="content">
                <todo-item-content/>
            </div>
        </template>
    </a-split>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useWindowSize} from "@vueuse/core";
import TodoItemContent from "@/pages/todo/components/todo-content/layout/todo-item-content.vue";
import TodoItemSide from "@/pages/todo/components/todo-content/layout/todo-item-side.vue";

const size = useWindowSize();


const max = computed(() => (size.width.value - 200) + 'px');


</script>
<style lang="less">
.todo-layout-list {
    width: 100%;
    height: 100%;
    overflow-x: scroll;

    .list {
        position: relative;
        height: 100%;
        width: 100%;
    }


    .content {
        position: relative;
        height: 100%;
        width: 100%;
    }

}
</style>
