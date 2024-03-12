<template>
    <main class="main">
        <div class="card-item" v-if="showTodo" :style="style">
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
                <card-todo-item v-for="item in todoList" :key="item.id" :item="item" :data-id="item.id" :attr="true"/>
            </div>
        </div>
        <div class="card-item" v-if="showComplete" :style="style">
            <div class="title">
                已完成
                <a-tag class="length" color="green">{{ completeList.length }}</a-tag>
            </div>
            <div class="content" ref="completeRef">
                <card-todo-item v-for="item in completeList" :key="item.id" :item="item" :data-id="item.id"/>
            </div>
        </div>
        <div class="card-item" v-if="showAbandon" :style="style">
            <div class="title">
                已取消
                <a-tag class="length" color="orange">{{ abandonList.length }}</a-tag>
            </div>
            <div class="content" ref="abandonRef">
                <card-todo-item v-for="item in abandonList" :key="item.id" :item="item" :data-id="item.id"/>
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
                        <a-link :item="item" @click="toArticle(item.id)">{{ item.name }}</a-link>
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
import {ifObjectIsNull} from "@/utils/lang/ObjUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {
    openAddRelationArticle
} from "@/pages/todo/components/common/AddRelationArticle";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {TodoArticleActionEnum} from "@/entity/setting/BaseSetting";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openArticle} from "@/pages/todo/components/common/OpenArticle";
import {useRouter} from "vue-router";
import {contains} from "@/utils/lang/ArrayUtil";

const router = useRouter();

const todoRef = ref<HTMLDivElement>();
const completeRef = ref<HTMLDivElement>();
const abandonRef = ref<HTMLDivElement>();

const todoList = computed(() => {
    const category = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
    return useTodoStore().todoList
        .sort((a, b) => sortTodoIndex(a, b, ifObjectIsNull(category, 'todoListSort', TodoListSortEnum.PRIORITY)));
});
const completeList = computed(() => useTodoStore().completeList);
const abandonList = computed(() => useTodoStore().abandonList);
const articleList = computed(() => useTodoStore().articleList);

const hides = computed(() => useTodoStore().hides);


const showTodo = computed(() => !contains(hides.value, '1'));
const showComplete = computed(() => !contains(hides.value, '2'));
const showAbandon = computed(() => !contains(hides.value, '3'));
const showArticle = computed(() => !contains(hides.value, '4'));

const style = computed(() => {
    return {
        maxWidth: '400px',
        minWidth: '233px'
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
<style scoped>

</style>
