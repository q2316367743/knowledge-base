<template>
    <a-input v-model="titleWrap" allow-clear class="input" :placeholder="placeholder" @keydown.enter="submit()"
             :disabled="id === 0" size="mini">
        <template #suffix>
            <!-- 优先级 -->
            <a-dropdown position="br" @select="updatePriority($event)"  :disabled="disabled">
                <a-button type="text" :style="{color: color}" class="priority" size="mini">
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
        </template>
    </a-input>
</template>
<script lang="ts" setup>
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
import {computed, ref} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";


const titleWrap = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);

const id = computed(() => useTodoStore().id);
const disabled = computed(() => useTodoStore().id === 0);
const color = computed(() => handlePriorityColor(priority.value));
const percent = computed(() => {
    if (useTodoStore().todoItems.length === 0) {
        return 0;
    }
    const all = useTodoStore().todoList.length + useTodoStore().completeList.length;
    const value = useTodoStore().completeList.length / all;
    return parseFloat(value.toFixed(4))
});
const placeholder = computed(() => {
    if (id.value === 0) {
        return '';
    }
    if (useTodoStore().title.length > 0) {
        return `添加任务到“${useTodoStore().title}”，回车即可创建`;
    } else {
        return '';
    }
});

function updatePriority(value: any) {
    priority.value = value;
}
function submit() {
    useTodoStore().addSimple({
        title: titleWrap.value,
        priority: priority.value
    }).then(() => {
        MessageUtil.success("新增成功");
        titleWrap.value = '';
        priority.value = TodoItemPriority.NONE;
    }).catch(e => MessageUtil.error("新增失败", e))
}

</script>
<style scoped>

</style>
