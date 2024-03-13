<template>
    <div class="card-todo-item" :class="{deleted: index.status !== TodoItemStatus.TODO}"
         :style="style"
         @click="_openTodoItemInfo()">
        <a-typography-paragraph style="margin-top: 9px" :ellipsis="ellipsis">
            {{ index.title }}
        </a-typography-paragraph>
        <div v-if="hasAttr" style="text-align: right;font-size: 0.8rem">
            <a-tag color="orange">
                <template #icon>
                    <icon-clock-circle/>
                </template>
                {{ start }}{{ end ? ' · ' + end : '' }}
            </a-tag>
        </div>
        <a-tooltip content="置顶" v-if="(index.top && index.status === TodoItemStatus.TODO) || props.showTop">
            <div class="top">
                <icon-arrow-up/>
            </div>
        </a-tooltip>
    </div>
</template>
<script lang="ts" setup>
import {computed, PropType, ref} from "vue";
import {
    getDefaultTodoItemAttr,
    getDefaultTodoItemIndex,
    handlePriorityColor,
    TodoItemIndex,
    TodoItemStatus
} from "@/entity/todo/TodoItem";
import {openTodoItemInfo} from "@/pages/todo/components/common/TodoItemInfo";
import {useTodoStore} from "@/store/components/TodoStore";
import {toDateString} from "xe-utils";
import {handleDate} from "@/utils/lang/ObjUtil";

const props = defineProps({
    item: Object as PropType<TodoItemIndex>,
    attr: {
        type: Boolean,
        default: false
    },
    showTop: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['update']);

const ellipsis = {
    rows: 3,
    expandable: true,
};

const attr = ref(getDefaultTodoItemAttr());
const hasAttr = ref(false);
const start = ref('');
const end = ref('');
const index = ref(props.item || getDefaultTodoItemIndex())

const style = computed(() => {
    if (!index.value) {
        return {};
    }
    return {
        borderLeft: '4px solid ' + handlePriorityColor(index.value.priority)
    }
});

const createTime = computed(() => index.value ? toDateString(index.value.createTime, "yyyy-MM-dd HH:mm") : '')

function _openTodoItemInfo() {
    if (!index.value) {
        return;
    }
    openTodoItemInfo(index.value, res => {
        index.value = res
        if (index.value) {
            initAttr(index.value.id);
            emits('update', index.value.id);
        }
    })
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

if (props.attr && index.value) {
    initAttr(index.value.id);
}

</script>
<style scoped lang="less">
.card-todo-item {
    padding: 8px 12px;
    margin: 14px 4px;
    border-radius: 2px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    background-color: var(--color-fill-2);
    position: relative;

    &.deleted {
        color: var(--color-text-4);
        background-color: var(--color-fill-1);

        .arco-typography {
            color: var(--color-text-4);
        }
    }

    .top {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgb(var(--orange-6));
        color: var(--color-fill-2);
        clip-path: polygon(0 0, 100% 100%, 100% 0);
        width: 25px;
        height: 25px;
        text-align: right;
    }
}
</style>
