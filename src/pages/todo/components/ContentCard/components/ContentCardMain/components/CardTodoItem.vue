<template>
    <div class="card-todo-item" v-if="item" :style="style" @click="_openTodoItemInfo()">
        <p>{{ item.title }}</p>
        <div v-if="hasAttr" style="text-align: right;font-size: 0.8rem">
            <a-tag color="orange">
                <template #icon>
                    <icon-clock-circle/>
                </template>
                {{start}}{{ end ? ' - ' + end : ''}}
            </a-tag>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, PropType, ref} from "vue";
import {getDefaultTodoItemAttr, handlePriorityColor, TodoItemIndex} from "@/entity/todo/TodoItem";
import {openTodoItemInfo} from "@/pages/todo/components/ContentCard/components/ContentCardMain/components/TodoItemInfo";
import {useTodoStore} from "@/store/components/TodoStore";
import {toDateString} from "xe-utils";
import {handleDate} from "@/utils/lang/ObjUtil";

const props = defineProps({
    item: Object as PropType<TodoItemIndex>,
    attr: {
        type: Boolean,
        default: false
    }
});

const attr = ref(getDefaultTodoItemAttr());
const hasAttr = ref(false);
const start = ref('');
const end = ref('');

const style = computed(() => {
    if (!props.item) {
        return {};
    }
    return {
        borderLeft: '4px solid ' + handlePriorityColor(props.item.priority)
    }
});

const createTime = computed(() => props.item ? toDateString(props.item.createTime, "yyyy-MM-dd HH:mm") : '')

function _openTodoItemInfo() {
    if (!props.item) {
        return;
    }
    openTodoItemInfo(props.item, () => props.item && initAttr(props.item.id))
}

function initAttr(id: number) {
    hasAttr.value = false;
    useTodoStore().getTodoItemAttr(id)
        .then(res => {
            attr.value = res;
            if (res.start !== '') {
                start.value = handleDate(res.start);
                hasAttr.value = true;
            }
            if (res.end !== '' && res.start !== res.end && res.start !== '') {
                start.value = toDateString(res.start, "yyyy-MM-dd");
                end.value = toDateString(res.end, "yyyy-MM-dd");
                hasAttr.value = true;
            }

        })

}

if (props.attr && props.item) {
    initAttr(props.item.id);
}

</script>
<style scoped>

</style>
