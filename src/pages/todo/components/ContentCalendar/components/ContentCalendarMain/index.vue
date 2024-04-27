<template>
    <div class="content-calendar-main">
        <div class="calendar">
            <calendar expanded :is-dark="isDark" :attributes="attributes" title-position="left" @dayclick="onDayClick"
                      transparent/>
            <div class="article" v-if="todoCategory && !todoCategory.hideOfArticle">
                <div class="title">关联文章</div>
                <div class="list">
                    <a-list :bordered="false">
                        <a-list-item v-for="article in articleList">
                            <a-link @click="toArticleByTodo(article.id)">{{article.name}}</a-link>
                        </a-list-item>
                    </a-list>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="title">
                {{ title }}
            </div>
            <div class="list">
                <card-todo-item v-for="index in indexes" :item="index" @update="onUpdate" :key="index.id" attr only/>
            </div>
        </div>
        <div class="add">
            <a-button type="primary" @click="openAddTodoItem()" shape="circle" size="large">
                <template #icon>
                    <icon-plus/>
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Calendar} from 'v-calendar';
import {useGlobalStore} from "@/store/GlobalStore";
import {sortTodoIndex, useTodoStore} from "@/store/components/TodoStore";
import {handleSimplePriorityColor, TodoItemIndex} from "@/entity/todo/TodoItem";
import {map} from "@/utils/lang/ArrayUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {useRouter} from "vue-router";
import {toArticleByTodo} from "@/components/ArticePreview/OpenArticle";

const router = useRouter();

interface Attribute {
    key: string | number;
    highlight?: string;
    dates: Date | Array<Date | Array<Date>>;
    dot?: boolean | string;
}

const attributes = ref<Array<any>>([]);
const indexes = ref<Array<TodoItemIndex>>([]);
const title = ref("请选择日期");

const todoList = computed(() => useTodoStore().todoList);
const completeList = computed(() => useTodoStore().completeList);
const abandonList = computed(() => useTodoStore().abandonList);
const articleList = computed(() => useTodoStore().articleList);

const todoCategory = computed(() => useTodoCategoryStore().todoCategoryMap.get(useTodoStore().categoryId));

const items = computed<Array<TodoItemIndex>>(() => {

    if (!todoCategory.value) {
        return [];
    }

    const temp = new Array<TodoItemIndex>();

    !todoCategory.value.hideOfTodo && temp.push(...todoList.value);
    !todoCategory.value.hideOfComplete && temp.push(...completeList.value);
    !todoCategory.value.hideOfAbandon && temp.push(...abandonList.value);

    return temp;
})

const isDark = computed(() => useGlobalStore().isDark);

const todoMap = computed(() => map(items.value, 'id'));

watch(() => items.value, value => buildAttributes(value).then(res => attributes.value = res), {
    deep: true,
    immediate: true
})

async function buildAttributes(indexes: Array<TodoItemIndex>): Promise<Array<Attribute>> {
    const attrs = await useTodoStore().getMultiTodoItemAttr(indexes.map(index => index.id));
    const attrMap = map(attrs, 'id');

    return Promise.resolve(indexes.map(index => {
        const attr = attrMap.get(LocalNameEnum.TODO_ATTR + index.id);

        let dot: boolean | undefined = true;
        let dates: Date | Date[][] = new Date(index.id);

        if (attr) {
            if (attr.record.start !== attr.record.end) {
                dot = undefined;
                dates = [[new Date(attr.record.start), new Date(attr.record.end)]];
            } else if (attr.record.start) {
                dates = new Date(attr.record.start)
            }
        }

        const color = handleSimplePriorityColor(index.priority);

        return {
            key: index.id,
            highlight: dot ? undefined : color,
            dates: dates,
            dot: dot ? color : undefined,
        }
    }));
}

function onDayClick(a: any) {
    indexes.value = [];
    const attributes = a.attributes as Array<Attribute>;
    const temp = new Array<TodoItemIndex>();
    for (let attribute of attributes) {
        const todoItemIndex = todoMap.value.get(attribute.key as number);
        if (todoItemIndex) {
            temp.push(todoItemIndex);
        }
    }
    indexes.value = temp.sort((a, b) => sortTodoIndex(a, b, useTodoStore().sort));
    title.value = a.id;
}

function onUpdate() {
    const temp = new Array<TodoItemIndex>();
    for (let valueElement of indexes.value) {
        const todoItemIndex = todoMap.value.get(valueElement.id);
        if (todoItemIndex) {
            temp.push(todoItemIndex);
        }
    }
    indexes.value = temp.sort((a, b) => sortTodoIndex(a, b, useTodoStore().sort));
}

</script>
<style scoped>

</style>
