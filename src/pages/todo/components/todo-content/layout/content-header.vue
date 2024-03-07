<template>
    <div class="header-wrap">
        <header class="header">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu/>
                </template>
            </a-button>
            <div class="title">{{ title }}</div>
            <a-button-group type="text">
                <!-- 排序 -->
                <a-dropdown position="br" @select="setTodoListSort($event)">
                    <a-button>
                        <template #icon>
                            <icon-sort/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption :value="TodoListSortEnum.PRIORITY">
                            <template #icon>
                                <icon-check v-if="todoListSort === TodoListSortEnum.PRIORITY"/>
                                <a-icon v-else/>
                            </template>
                            优先级
                        </a-doption>
                        <a-doption :value="TodoListSortEnum.NAME_ASC">
                            <template #icon>
                                <icon-check v-if="todoListSort === TodoListSortEnum.NAME_ASC"/>
                                <a-icon v-else/>
                            </template>
                            名称正序
                        </a-doption>
                        <a-doption :value="TodoListSortEnum.NAME_DESC">
                            <template #icon>
                                <icon-check v-if="todoListSort === TodoListSortEnum.NAME_DESC"/>
                                <a-icon v-else/>
                            </template>
                            名称倒序
                        </a-doption>
                        <a-doption :value="TodoListSortEnum.CREATE_TIME_ASC">
                            <template #icon>
                                <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_ASC"/>
                                <a-icon v-else/>
                            </template>
                            创建时间正序
                        </a-doption>
                        <a-doption :value="TodoListSortEnum.CREATE_TIME_DESC">
                            <template #icon>
                                <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_DESC"/>
                                <a-icon v-else/>
                            </template>
                            创建时间倒序
                        </a-doption>
                    </template>
                </a-dropdown>
                <!-- 更多 -->
                <a-dropdown position="br">
                    <a-button>
                        <template #icon>
                            <icon-more-vertical/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="association()" :disabled="disabled">
                            <template #icon>
                                <icon-file/>
                            </template>
                            关联文章
                        </a-doption>
                        <a-doption :disabled="disabled" @click="open()">
                            <template #icon>
                                <icon-export/>
                            </template>
                            导出
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </header>
        <div style="padding: 0 4px">
            <a-progress :percent="percent"/>
        </div>
        <a-input v-model="titleWrap" allow-clear class="input" :placeholder="placeholder" @keydown.enter="submit()"
                 :disabled="id === 0">
            <template #suffix>
                <!-- 优先级 -->
                <a-dropdown position="br" @select="updatePriority($event)">
                    <a-button type="text" :style="{color: color}" class="priority">
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
        <todo-export v-model:visible="exportVisible"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/MessageUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {getDefaultTodoCategory} from "@/entity/todo/TodoCategory";
import {useTodoAddArticleEvent} from "@/global/BeanFactory";
import TodoExport from "@/pages/todo/components/todo-content/components/todo-export.vue";
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";

const id = computed(() => useTodoStore().id);
const title = computed(() => useTodoStore().title);
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
const disabled = computed(() => useTodoStore().id === 0);

const titleWrap = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);
const todoListSort = ref<TodoListSortEnum>(TodoListSortEnum.PRIORITY);
const exportVisible = ref(false);

const color = computed(() => handlePriorityColor(priority.value));
const percent = computed(() => {
    if (useTodoStore().todoItems.length === 0) {
        return 0;
    }
    const value = useTodoStore().todoList.length / useTodoStore().todoItems.length
    return parseFloat(value.toFixed(4))
})

watch(() => useTodoStore().id, value => getTodoListSort(value), {immediate: true});

function getTodoListSort(id: number) {
    if (id === 0) {
        todoListSort.value = TodoListSortEnum.PRIORITY;
        return;
    }
    const category = useTodoCategoryStore().todoCategoryMap.get(id);
    if (category) {
        todoListSort.value = getDefaultTodoCategory(category).todoListSort;
    }
}

const switchCollapsed = () => useTodoStore().switchCollapsed();

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

const setTodoListSort = (value: any) => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {todoListSort: value})
        .then(() => {
            todoListSort.value = value;
        })
        .catch(e => MessageUtil.error("更新待办列表排序异常", e));
}

function association() {
    useTodoAddArticleEvent.emit();
}

function open() {
    exportVisible.value = true;
}

function updatePriority(value: any) {
    priority.value = value;
}

</script>
<style lang="less">
.header-wrap {
    position: relative;
    width: 100%;

    .header {
        display: grid;
        height: 32px;
        padding: 7px 7px 0;
        grid-template-columns: 32px 1fr 64px;

        .title {
            margin-left: 7px;
            line-height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .input {
        width: calc(100% - 14px);
        margin: 7px 7px;
        padding-right: 0;

        .arco-input-suffix {
            padding-left: 0;
        }
    }
}
</style>
