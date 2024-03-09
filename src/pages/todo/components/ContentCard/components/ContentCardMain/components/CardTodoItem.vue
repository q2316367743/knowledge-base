<template>
    <div class="card-todo-item" v-if="item" :style="style" @click="_openTodoItemInfo()">
        {{ item.title }}
    </div>
</template>
<script lang="ts" setup>
import {computed, PropType} from "vue";
import {handlePriorityColor, TodoItemIndex} from "@/entity/todo/TodoItem";
import {openTodoItemInfo} from "@/pages/todo/components/ContentCard/components/ContentCardMain/components/TodoItemInfo";

const props = defineProps({
    item: Object as PropType<TodoItemIndex>
});

const style = computed(() => {
    if (!props.item) {
        return {};
    }
    return {
        borderLeft: '4px solid ' + handlePriorityColor(props.item.priority)
    }
});

function _openTodoItemInfo() {
    if (!props.item) {
        return;
    }
    openTodoItemInfo(props.item)
}


</script>
<style scoped>

</style>
