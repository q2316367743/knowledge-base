<template>
    <header class="header">
        <a-button type="text" @click="switchCollapsed()">
            <template #icon>
                <icon-menu/>
            </template>
        </a-button>
        <div class="title">{{ title }}</div>
        <div style="padding: 5px">
            <a-progress :percent="percent"/>
        </div>
        <a-button-group type="text">
            <!-- 排序 -->
            <a-dropdown position="br" @select="setTodoListSort($event)" :disabled="disabled">
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
                    <a-doption :disabled="disabled" @click="openTodoExport()">
                        <template #icon>
                            <icon-export/>
                        </template>
                        导出
                    </a-doption>
                    <a-doption :disabled="disabled" @click="openTodoSetting()">
                        <template #icon>
                            <icon-settings/>
                        </template>
                        设置
                    </a-doption>
                </template>
            </a-dropdown>
        </a-button-group>
    </header>
</template>
<script lang="ts" setup>
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {useTodoStore} from "@/store/components/TodoStore";
import {computed} from "vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openTodoExport} from "@/pages/todo/components/common/TodoExport";
import {openTodoSetting} from "@/pages/todo/components/ContentCard/components/ContentCardMain/components/TodoSetting";

const disabled = computed(() => useTodoStore().id === 0);
const title = computed(() => useTodoStore().title);
const todoListSort = computed<TodoListSortEnum>(() => useTodoStore().sort);

const percent = computed(() => {
    if (useTodoStore().todoItems.length === 0) {
        return 0;
    }
    const all = useTodoStore().todoList.length + useTodoStore().completeList.length;
    const value = useTodoStore().completeList.length / all;
    return parseFloat(value.toFixed(4))
});

const switchCollapsed = () => useTodoStore().switchCollapsed();
const setTodoListSort = (value: any) => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {todoListSort: value})
        // 更新成功，刷新数据
        .then(() => useTodoStore().setId(useTodoStore().id))
        .catch(e => MessageUtil.error("更新待办列表排序异常", e));
}
</script>
<style scoped>

</style>
