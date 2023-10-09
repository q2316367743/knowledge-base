<template>
    <div class="list">
        <content-header/>
        <div class="list-container">
            <div v-for="item in todoList" class="todo-layout-list-item" :class="itemId === item.id ? 'active' : ''"
                 :key="item.id">
                <a-checkbox :default-checked="false" @change="updateStatus(item.id, TodoItemStatus.COMPLETE)">
                </a-checkbox>
                <div class="title" @click="setItemId(item.id)" :style="{color: handleColor(item)}">
                    {{ item.title }}
                </div>
                <a-tooltip :content="(item.top? '取消': '') + '置顶'" position="right">
                    <a-button type="text" :style="{color: item.top ? 'rgb(var(--orange-6))' : 'var(--color-neutral-4)'}"
                              @click="updateTop(item.id, !item.top)">
                        <template #icon>
                            <icon-arrow-rise/>
                        </template>
                    </a-button>
                </a-tooltip>
            </div>
            <a-divider orientation="left">已完成</a-divider>
            <div v-for="item in completeList" class="todo-layout-list-item" :class="itemId === item.id ? 'active' : ''"
                 :key="item.id">
                <a-checkbox :default-checked="true" @change="updateStatus(item.id, TodoItemStatus.TODO)">
                </a-checkbox>
                <p class="title" @click="setItemId(item.id)" style="text-decoration: line-through;margin: 0">
                    {{ item.title }}
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {handlePriorityColor, TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";
import {useWindowSize} from "@vueuse/core";
import {computed} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/MessageUtil";
import ContentHeader from "@/pages/todo/components/todo-content/layout/content-header.vue";
import {useGlobalStore} from "@/store/GlobalStore";


const size = useWindowSize();

const itemId = computed(() => useTodoStore().itemId);
const todoList = computed(() => useTodoStore().todoList);
const completeList = computed(() => useTodoStore().completeList);

const max = computed(() => (size.width.value - 200) + 'px');

const updateTop = (id: number, top: boolean) => useTodoStore().updateById(id, {top})
    .then(() => MessageUtil.success(top ? "已置顶" : "取消置顶"))
    .catch(e => MessageUtil.error((top ? "置顶" : "取消置顶") + "失败", e));
const setItemId = (itemId: number) => useTodoStore().setItemId(itemId);

const handleColor = (item: TodoItemIndex): string => handlePriorityColor(item.priority);

function updateStatus(itemId: number, status: TodoItemStatus) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId, {status: status})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败"))
        .finally(() => useGlobalStore().closeLoading());
}

</script>
<style scoped lang="less">
.list {
    .list-container {
        position: absolute;
        top: 85px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;

        .todo-layout-list-item {
            padding: 4px 7px;
            border-bottom: 1px solid var(--color-neutral-3);
            display: grid;
            grid-template-columns: 30px 1fr 32px;
            height: 32px;
            line-height: 32px;
            cursor: pointer;

            &:last-child {
                border-bottom: 1px solid transparent;
            }

            &:hover {
                background-color: var(--color-neutral-2);
            }

            &.active {
                background-color: var(--color-neutral-3);
            }

            .extra {
                color: rgb(var(--orange-6));

                &.disabled {
                    color: var(--color-neutral-4);
                }
            }
        }
    }
}
</style>
