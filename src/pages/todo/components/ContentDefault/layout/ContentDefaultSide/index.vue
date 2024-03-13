<template>
    <div class="list">
        <side-header/>
        <div class="list-container" @click="setItemId(0)">
            <!-- 待办 -->
            <a-divider orientation="left" v-if="todoList.length > 0"
                       :style="{marginBottom: hideOfTodo ? '33px':'13px'}">
                <span style="cursor: pointer;color: var(--color-text-1);"
                      @click.stop="hideOfTodo = !hideOfTodo">
                    <icon-right v-if="hideOfTodo"/>
                    <icon-down v-else/>
                    待办
                </span>
            </a-divider>
            <div v-if="!hideOfTodo" v-for="item in todoList" class="todo-layout-list-item"
                 :class="itemId === item.id ? 'active' : ''"
                 :key="item.id" @click.stop>
                <a-checkbox :default-checked="false" @change="updateStatus(item.id, TodoItemStatus.COMPLETE)">
                </a-checkbox>
                <a-dropdown align-point trigger="contextMenu">
                    <div class="title" @click="setItemId(item.id)" :style="{color: handleColor(item)}">
                        {{ item.title }}
                    </div>
                    <template #content>
                        <a-dsubmenu>
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
                <a-tooltip :content="(item.top? '取消': '') + '置顶'" position="right">
                    <a-button type="text" :style="{color: item.top ? 'rgb(var(--orange-6))' : 'var(--color-neutral-4)'}"
                              @click="updateTop(item.id, !item.top)">
                        <template #icon>
                            <icon-arrow-rise/>
                        </template>
                    </a-button>
                </a-tooltip>
            </div>
            <!-- 已完成 -->
            <a-divider orientation="left" v-if="completeList.length > 0"
                       :style="{marginBottom: hideOfComplete ? '33px':'13px'}">
                <span style="cursor: pointer;color: rgb(var(--green-6));"
                      @click.stop="hideOfComplete = !hideOfComplete">
                    <icon-right v-if="hideOfComplete"/>
                    <icon-down v-else/>
                    已完成
                </span>
            </a-divider>
            <div v-if="!hideOfComplete" v-for="item in completeList" class="todo-layout-list-item"
                 :class="itemId === item.id ? 'active' : ''"
                 :key="item.id" @click.stop>
                <a-checkbox :default-checked="true" @change="updateStatus(item.id, TodoItemStatus.TODO)">
                </a-checkbox>
                <a-dropdown align-point trigger="contextMenu">
                    <div class="title gray delete" @click="setItemId(item.id)" :style="{color: handleColor(item)}">
                        {{ item.title }}
                    </div>
                    <template #content>
                        <a-doption style="color: rgb(var(--red-6));" @click="removeById(item.id)">
                            <template #icon>
                                <icon-delete/>
                            </template>
                            删除
                        </a-doption>
                    </template>
                </a-dropdown>

            </div>
            <!-- 已放弃 -->
            <a-divider orientation="left" v-if="abandonList.length > 0"
                       :style="{marginBottom: hideOfAbandon ? '33px':'13px'}">
                <span style="cursor: pointer;color: rgb(var(--orange-6));" @click.stop="hideOfAbandon = !hideOfAbandon">
                    <icon-right v-if="hideOfAbandon"/>
                    <icon-down v-else/>
                    已放弃
                </span>
            </a-divider>
            <div v-if="!hideOfAbandon" v-for="item in abandonList" class="todo-layout-list-item"
                 :class="itemId === item.id ? 'active' : ''"
                 :key="item.id" @click.stop>
                <a-checkbox :default-checked="true" @change="updateStatus(item.id, TodoItemStatus.TODO)">
                </a-checkbox>
                <p class="title gray" @click="setItemId(item.id)" style="text-decoration: line-through;margin: 0">
                    {{ item.title }}
                </p>
            </div>
            <!-- 关联的文章 -->
            <a-divider orientation="left" v-if="articleList.length > 0">
                <span style="cursor: pointer;color: rgb(var(--arcoblue-6));"
                      @click.stop="hideOfArticle = !hideOfArticle">
                    <icon-right v-if="hideOfArticle"/>
                    <icon-down v-else/>
                    关联的文章
                </span>
            </a-divider>
            <a-typography v-if="!hideOfArticle" style="padding: 0 7px;">
                <a-typography-paragraph v-for="item in articleList" :key="item.id" @click.stop>
                    <a-link @click="toArticle(item.id)">{{ item.name }}</a-link>
                </a-typography-paragraph>
            </a-typography>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useWindowSize} from "@vueuse/core";
import {computed, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {handlePriorityColor, TodoItemIndex, TodoItemPriority, TodoItemStatus} from "@/entity/todo/TodoItem";
import {getDefaultTodoCategory} from "@/entity/todo/TodoCategory";
// 存储
import {sortTodoIndex, useTodoStore} from "@/store/components/TodoStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
// 工具类
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import SideHeader from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/SideHeader.vue"
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {TodoArticleActionEnum} from "@/entity/setting/BaseSetting";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openArticle} from "@/pages/todo/components/common/OpenArticle";
import {ifObjectIsNull} from "@/utils/lang/ObjUtil";


const size = useWindowSize();
const router = useRouter();

const hideOfTodo = ref(false);
const hideOfComplete = ref(false);
const hideOfAbandon = ref(false);
const hideOfArticle = ref(false);

const itemId = computed(() => useTodoStore().itemId);
const todoList = computed(() => {
    const category = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
    return useTodoStore().todoList
        .sort((a, b) => sortTodoIndex(a, b, ifObjectIsNull(category, 'todoListSort', TodoListSortEnum.PRIORITY)));
});
const completeList = computed(() => useTodoStore().completeList);
const abandonList = computed(() => useTodoStore().abandonList);
const articleList = computed(() => useTodoStore().articleList);

const max = computed(() => (size.width.value - 200) + 'px');

function getHide(id: number) {
    if (id === 0) {
        hideOfComplete.value = false;
        hideOfAbandon.value = false;
        hideOfArticle.value = false;
        return;
    }
    const category = useTodoCategoryStore().todoCategoryMap.get(id);
    if (category) {
        hideOfTodo.value = getDefaultTodoCategory(category).hideOfTodo;
        hideOfComplete.value = getDefaultTodoCategory(category).hideOfComplete;
        hideOfAbandon.value = getDefaultTodoCategory(category).hideOfAbandon;
        hideOfArticle.value = getDefaultTodoCategory(category).hideOfArticle;
    }
}

watch(() => useTodoStore().id, () => getHide(useTodoStore().id), {immediate: true});

watch(() => hideOfTodo.value, value => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {hideOfTodo: value})
        .catch(e => MessageUtil.error("更新隐藏待办异常", e))
});
watch(() => hideOfComplete.value, value => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {hideOfComplete: value})
        .catch(e => MessageUtil.error("更新隐藏已完成异常", e))
});
watch(() => hideOfAbandon.value, value => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {hideOfAbandon: value})
        .catch(e => MessageUtil.error("更新隐藏已放弃异常", e))
});
watch(() => hideOfArticle.value, value => {
    if (useTodoStore().id === 0) {
        return;
    }
    useTodoCategoryStore()
        .update(useTodoStore().id, {hideOfArticle: value})
        .catch(e => MessageUtil.error("更新隐藏文章异常", e))
});

const updateTop = (id: number, top: boolean) => useTodoStore().updateById(id, {top})
    .then(() => MessageUtil.success(top ? "已置顶" : "取消置顶"))
    .catch(e => MessageUtil.error((top ? "置顶" : "取消置顶") + "失败", e));
const setItemId = (itemId: number) => useTodoStore().setItemId(itemId);

const handleColor = (item: TodoItemIndex): string => handlePriorityColor(item.priority);

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
            if (e !== 'cancel') {
                MessageUtil.error("更新失败", e)
            }
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

function toArticle(id: number) {
    if (useBaseSettingStore().todoArticleAction === TodoArticleActionEnum.TO_ARTICLE) {
        useHomeEditorStore().openArticle(id);
        router.push('/home');
    } else if (useBaseSettingStore().todoArticleAction === TodoArticleActionEnum.DRAWER) {
        const article = useArticleStore().articleMap.get(id);
        if (!article) {
            MessageUtil.error("文章不存在");
            return;
        }
        openArticle(article);
    }
}

</script>
<style scoped lang="less">

</style>
