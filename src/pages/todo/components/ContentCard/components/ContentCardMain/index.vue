<template>
    <main class="main">
      <div class="card-item" v-if="showDoing" :style="style">
            <div class="title">
                待办
                <a-tag class="length">{{ todoList.length }}</a-tag>
            </div>
            <div class="extra">
                <a-button type="text" @click="openAddTodoItem()">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </div>
            <div class="content" ref="todoRef">
                <card-todo-item v-for="item in todoList" :key="item.id" :item="item" :data-id="item.id" attr
                                :only="hides.length == 3"/>
            </div>
        </div>
        <div class="card-item" v-if="showDoing" :style="style">
            <div class="title">
                进行中
                <a-tag class="length" color="purple">{{ doingList.length }}</a-tag>
            </div>
            <div class="content" ref="doingRef">
                <card-todo-item v-for="item in doingList" :key="item.id" :item="item" :data-id="item.id" attr
                                :show-top="false"/>
            </div>
        </div>
        <div class="card-item" v-if="showComplete" :style="style">
            <div class="title">
                已完成
                <a-tag class="length" color="green">{{ completeList.length }}</a-tag>
            </div>
            <div class="content" ref="completeRef">
                <card-todo-item v-for="item in completeList" :key="item.id" :item="item" :data-id="item.id"
                                :show-top="false"/>
            </div>
        </div>
        <div class="card-item" v-if="showAbandon" :style="style">
            <div class="title">
                已取消
                <a-tag class="length" color="orange">{{ abandonList.length }}</a-tag>
            </div>
            <div class="content" ref="abandonRef">
                <card-todo-item v-for="item in abandonList" :key="item.id" :item="item" :data-id="item.id"
                                :show-top="false"/>
            </div>
        </div>
        <div class="card-item" v-if="showArticle" :style="style">
            <div class="title">
                关联的文章
                <a-tag class="length" color="arcoblue">{{ articleList.length }}</a-tag>
            </div>
            <div class="extra">
                <a-button type="text" @click="openAddRelationArticle()">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </div>
            <div class="content">
                <a-list :bordered="false">
                    <a-list-item v-for="item in articleList" :key="item.id">
                        <a-link :item="item" @click="toArticleByTodo(item.id)">{{ item.name }}</a-link>
                    </a-list-item>
                </a-list>
            </div>
        </div>
    </main>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import Sortable, {SortableEvent} from 'sortablejs';
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {sortTodoIndex, useTodoStore} from "@/store/components/TodoStore";
import {ifObjectIsNull} from "@/utils/lang/FieldUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {
    openAddRelationArticle
} from "@/pages/todo/components/common/AddRelationArticle";
import {contains} from "@/utils/lang/ArrayUtil";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";

const todoRef = ref<HTMLDivElement>();
const doingRef = ref<HTMLDivElement>();
const completeRef = ref<HTMLDivElement>();
const abandonRef = ref<HTMLDivElement>();

const todoList = computed(() => {
    const category = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
    return useTodoStore().todoList
        .sort((a, b) => sortTodoIndex(a, b, ifObjectIsNull(category, 'todoListSort', TodoListSortEnum.PRIORITY)));
});
const doingList = computed(() => useTodoStore().doingList);
const completeList = computed(() => useTodoStore().completeList);
const abandonList = computed(() => useTodoStore().abandonList);
const articleList = computed(() => useTodoStore().articleList);

const hides = computed(() => useTodoStore().hides);


const showTodo = computed(() => !contains(hides.value, '1'));
const showDoing = computed(() => !contains(hides.value, '5'));
const showComplete = computed(() => !contains(hides.value, '2'));
const showAbandon = computed(() => !contains(hides.value, '3'));
const showArticle = computed(() => !contains(hides.value, '4'));

const style = computed(() => {
    let length = [showTodo.value, showComplete.value, showAbandon.value, showArticle.value]
        .filter(e => e)
        .length;
    if (length === 0) {
        length = 1;
    }
    return {
        minWidth: '233px',
        width: Math.floor(100 / length) + '%',
    }
})

onMounted(() => {
    todoRef.value && new Sortable(todoRef.value, {
        group: 'shared', // set both lists to same group
        animation: 150,
        onAdd(e: SortableEvent) {
            updateItem(e, TodoItemStatus.TODO);
        }
    });

    doingRef.value && new Sortable(doingRef.value, {
        group: 'shared', // set both lists to same group
        animation: 150,
        onAdd(e: SortableEvent) {
            updateItem(e, TodoItemStatus.DOING);
        }
    });

    completeRef.value && new Sortable(completeRef.value, {
        group: 'shared',
        animation: 150,
        onAdd(e: SortableEvent) {
            updateItem(e, TodoItemStatus.COMPLETE);
        }
    });

    abandonRef.value && new Sortable(abandonRef.value, {
        group: 'shared',
        animation: 150,
        onAdd(e: SortableEvent) {
            updateItem(e, TodoItemStatus.ABANDON);
        }
    });
});

function updateItem(e: SortableEvent, status: TodoItemStatus) {
    const id = e.item.getAttribute('data-id');
    if (!id) {
        MessageUtil.warning("拖拽失败，无法获取待办项ID，请刷新后重试！");
        return;
    }
    const _id = parseInt(id);
    const item = useTodoStore().todoItems.find(e => e.id === _id);
    if (!item) {
        MessageUtil.warning("拖拽失败，待办不存在，请刷新后重试！");
        return;
    }
    useTodoStore().updateById(_id, {status: status})
        .then(() => MessageUtil.success("操作成功！"));

}

</script>
<style scoped>

</style>
