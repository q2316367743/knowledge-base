<template>
    <a-split class="todo-layout-list" default-size="300px" min="220px" :max="max">
        <template #first>
            <todo-item-side/>
        </template>
        <template #second>
            <div class="content">
                <a-result v-if="itemId === 0" status="404" title="请选择待办项"/>
                <a-result status="info" title="正在加载中" v-else-if="!show && itemId > 0">
                    <template #icon>
                        <icon-loading spin/>
                    </template>
                </a-result>
                <todo-item-content v-else-if="show"/>
            </div>
        </template>
    </a-split>
</template>
<script lang="ts" setup>
import {computed, nextTick, ref, watch} from "vue";
import {useWindowSize} from "@vueuse/core";
import TodoItemContent from "@/pages/todo/components/todo-content/layout/todo-item-content.vue";
import TodoItemSide from "@/pages/todo/components/todo-content/layout/TodoItemSide/index.vue";
import {useTodoStore} from "@/store/components/TodoStore";

const size = useWindowSize();
const show = ref(true);

const max = computed(() => (size.width.value - 200) + 'px');
const itemId = computed(() => useTodoStore().itemId);

watch(() => itemId.value, value => {
    if (value > 0) {
        show.value = false;
        nextTick(() => show.value = true);
    }
}, {immediate: true})


</script>
<style lang="less">
.todo-layout-list {
    width: 100%;
    height: 100%;

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
