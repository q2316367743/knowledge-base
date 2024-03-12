<template>
    <div class="content-calendar-main">
        <div class="header">
            <a-button type="primary">新建</a-button>
        </div>
        <div class="calendar">
            <calendar expanded :is-dark="isDark" :attributes="attributes" title-position="left" @dayclick="onDayClick" transparent/>
        </div>
        <div class="list">

        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {Calendar} from 'v-calendar';
import {useGlobalStore} from "@/store/GlobalStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {sortTodoIndex, useTodoStore} from "@/store/components/TodoStore";
import {ifObjectIsNull} from "@/utils/lang/ObjUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {handleSimplePriorityColor, TodoItemIndex} from "@/entity/todo/TodoItem";
import {map} from "@/utils/lang/ArrayUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {CalendarDay} from "v-calendar/dist/types/src/utils/page";


interface Attribute {
    key: string | number;
    highlight?: string;
    dates: Date | Array<Date | Array<Date>>;
    dot?: boolean | string;
}

const attributes = ref<Array<Attribute>>([]);

const todoList = computed(() => {
    const category = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().id);
    return useTodoStore().todoList
        .sort((a, b) => sortTodoIndex(a, b, ifObjectIsNull(category, 'todoListSort', TodoListSortEnum.PRIORITY)));
});
// const completeList = computed(() => useTodoStore().completeList);
// const abandonList = computed(() => useTodoStore().abandonList);
// const articleList = computed(() => useTodoStore().articleList);

const isDark = computed(() => useGlobalStore().isDark);
const itemId = computed(() => useTodoStore().itemId);

watch(() => todoList.value, value => buildAttributes(value).then(res => attributes.value = res), {
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

function onDayClick(a: CalendarDay, b: PointerEvent) {
    // TODO: 可以拿到attributes，就可以渲染右侧列表
    console.log(a, b)
}

</script>
<style scoped>

</style>
