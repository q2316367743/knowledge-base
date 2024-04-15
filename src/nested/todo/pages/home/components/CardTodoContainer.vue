<template>
    <div class="container list-container">
        <div v-for="item in todoList" class="todo-layout-list-item"
             :key="item.id" @click.stop>
            <a-checkbox :default-checked="false" @change="updateStatus(item.id, TodoItemStatus.COMPLETE)">
            </a-checkbox>
            <div class="title" @click="setItemId(item.id)" :style="{color: handleColor(item)}">
                {{ item.title }}
            </div>
            <a-tooltip :content="(item.top? '取消': '') + '置顶'" position="left">
                <a-button type="text" :style="{color: item.top ? 'rgb(var(--orange-6))' : 'var(--color-neutral-4)'}"
                          @click="updateTop(item.id, !item.top)">
                    <template #icon>
                        <icon-arrow-rise/>
                    </template>
                </a-button>
            </a-tooltip>
            <a-dropdown trigger="click" position="br">
                <a-button type="text">
                    <template #icon>
                        <icon-more/>
                    </template>
                </a-button>
                <template #content>
                    <a-dsubmenu position="lt">
                        <template #icon>
                            <icon-thunderbolt :style="{color:handlePriorityColor(item.priority)}"/>
                        </template>
                        <span :style="{color:handlePriorityColor(item.priority)}">优先级</span>
                        <template #content>
                            <a-doption :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                                       :value="TodoItemPriority.HIGH"
                                       @click="updatePriority(item.id, TodoItemPriority.HIGH)">
                                高优先级
                            </a-doption>
                            <a-doption :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                                       :value="TodoItemPriority.MIDDLE"
                                       @click="updatePriority(item.id, TodoItemPriority.MIDDLE)">
                                中优先级
                            </a-doption>
                            <a-doption :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                                       :value="TodoItemPriority.FLOOR"
                                       @click="updatePriority(item.id, TodoItemPriority.FLOOR)">
                                低优先级
                            </a-doption>
                            <a-doption :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                                       :value="TodoItemPriority.NONE"
                                       @click="updatePriority(item.id, TodoItemPriority.NONE)">
                                无优先级
                            </a-doption>
                        </template>
                    </a-dsubmenu>
                    <a-doption style="color: rgb(var(--orange-6));" @click="updateStatusToAbandon(item.id)">
                        <template #icon>
                            <icon-thumb-down/>
                        </template>
                        放弃
                    </a-doption>
                    <a-doption style="color: rgb(var(--red-6));" @click="removeById(item.id)">
                        <template #icon>
                            <icon-delete/>
                        </template>
                        删除
                    </a-doption>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {sortTodoIndex, useTodoStore} from "@/store/components/TodoStore";
import {ifObjectIsNull} from "@/utils/lang/ObjUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {handlePriorityColor, TodoItemIndex, TodoItemPriority, TodoItemStatus} from "@/entity/todo/TodoItem";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const todoList = computed(() => {
    const category = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
    return useTodoStore().todoList
        .sort((a, b) => sortTodoIndex(a, b, ifObjectIsNull(category, 'todoListSort', TodoListSortEnum.PRIORITY)));
});


function updateStatus(itemId: number, status: TodoItemStatus) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId, {status: status})
        .then(record => {
            if (record.status === TodoItemStatus.COMPLETE) {
                MessageUtil.success(`【${record.title}】已完成`)
            }
        })
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

function updatePriority(id: number, priority: TodoItemPriority) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(id, {priority})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}


const updateTop = (id: number, top: boolean) => useTodoStore().updateById(id, {top})
    .then(() => MessageUtil.success(top ? "已置顶" : "取消置顶"))
    .catch(e => MessageUtil.error((top ? "置顶" : "取消置顶") + "失败", e));


function removeById(id: number) {
    MessageBoxUtil.confirm("是否删除该待办项？", "删除提示", {
        confirmButtonText: "删除"
    }).then(() => {
        useGlobalStore().startLoading("开始删除待办项");
        useTodoStore().removeById(id)
            .then(() => MessageUtil.success("删除成功"))
            .catch(e => MessageUtil.error("删除失败", e))
            .finally(() => useGlobalStore().closeLoading());
    })
}

function updateStatusToAbandon(itemId: number) {
    useGlobalStore().startLoading("开始更新待办项");
    _updateStatusToAbandon(itemId)
        .then(record => {
            if (record.status === TodoItemStatus.COMPLETE) {
                MessageUtil.success(`【${record.title}】已完成`)
            }
        })
        .catch(e => {
            MessageUtil.error("更新失败", e)
        })
        .finally(() => useGlobalStore().closeLoading());
}

async function _updateStatusToAbandon(itemId: number): Promise<TodoItemIndex> {
    // 实时查询
    const attr = await useTodoStore().getTodoItemAttr(itemId);
    const reason = await MessageBoxUtil.prompt("请输入放弃原因", "放弃待办", {
        confirmButtonText: "放弃",
        cancelButtonText: "取消",
        inputValue: attr.reason
    });
    const record = await useTodoStore().updateById(itemId, {status: TodoItemStatus.ABANDON}, {reason})
    return Promise.resolve(record);
}

const setItemId = (itemId: number) => router.push('/info/' + itemId);
const handleColor = (item: TodoItemIndex): string => handlePriorityColor(item.priority);

</script>
<style scoped lang="less">
.list-container {

    .todo-layout-list-item {
        padding: 4px 7px;
        border-bottom: 1px solid var(--color-neutral-3);
        display: grid;
        grid-template-columns: 30px 1fr 32px 32px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;

        &:last-child {
            border-bottom: 1px solid transparent;
        }

        &:hover {
            background-color: var(--color-fill-3);
        }

        &.active {
            background-color: var(--color-fill-3);
        }

        .extra {
            color: rgb(var(--orange-6));

            &.disabled {
                color: var(--color-neutral-4);
            }
        }

        .gray {
            color: var(--color-neutral-6);
        }

        .delete {
            text-decoration: line-through
        }

        .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
