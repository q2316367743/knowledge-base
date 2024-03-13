<template>
    <header class="header">
        <!-- 标题 -->
        <div class="title">
            <a-input v-model="item.title" allow-clear placeholder="待办标题，回车修改"
                     @keydown.enter="updateTitle()"/>
        </div>
        <!-- 优先级 -->
        <a-dropdown position="br" @select="updatePriority($event)">
            <a-button type="dashed" :style="{color: color}" class="priority">
                <template #icon>
                    <icon-thunderbolt/>
                </template>
            </a-button>
            <template #content>
                <a-doption :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                           :value="TodoItemPriority.HIGH">
                    高优先级
                </a-doption>
                <a-doption :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                           :value="TodoItemPriority.MIDDLE">
                    中优先级
                </a-doption>
                <a-doption :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                           :value="TodoItemPriority.FLOOR">
                    低优先级
                </a-doption>
                <a-doption :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                           :value="TodoItemPriority.NONE">
                    无优先级
                </a-doption>
            </template>
        </a-dropdown>
    </header>
</template>
<script lang="ts" setup>
import {
    getDefaultTodoItemIndex,
    handlePriorityColor,
    TodoItemIndex,
    TodoItemPriority
} from "@/entity/todo/TodoItem";
import {computed, ref} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useGlobalStore} from "@/store/GlobalStore";

const item = ref<TodoItemIndex>(getDefaultTodoItemIndex());

const itemId = computed(() => useTodoStore().itemId);
const color = computed(() => handlePriorityColor(item.value.priority));


init(itemId.value);

function init(id: number) {
    if (id === 0) {
        return;
    }
    // 获取内容
    const index = useTodoStore().todoItems.find(e => e.id === id);
    if (index) {
        item.value = index;
    }
}

function updateTitle() {
    useTodoStore().updateById(item.value.id, {title: item.value.title})
        .catch(e => MessageUtil.error("更新标题失败", e));
}

function updatePriority(priority: any) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId.value, {priority})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}
</script>
<style scoped>

</style>
