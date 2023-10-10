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
                <a-dropdown position="br" disabled>
                    <a-button>
                        <template #icon>
                            <icon-more-vertical/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption>
                            <template #icon>
                                <icon-export/>
                            </template>
                            导出
                        </a-doption>
                        <a-doption>
                            <template #icon>
                                <icon-list/>
                            </template>
                            切换样式
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </header>
        <a-input v-model="titleWrap" allow-clear class="input" :placeholder="placeholder" @keydown.enter="submit()"
                 :disabled="id === 0"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/MessageUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";

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

const titleWrap = ref("");
const todoListSort = computed<TodoListSortEnum>(() => useTodoStore().todoListSort)

const switchCollapsed = () => useTodoStore().switchCollapsed();

function submit() {
    useTodoStore().addSimple(titleWrap.value)
        .then(() => {
            MessageUtil.success("新增成功");
            titleWrap.value = ''
        })
        .catch(e => MessageUtil.error("新增失败", e))
}

const setTodoListSort = (value: any) => useTodoStore().setTodoListSort(value);

</script>
<style scoped lang="less">
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
    }
}
</style>
