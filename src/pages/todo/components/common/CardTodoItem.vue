<template>
    <div class="card-todo-item" :class="{deleted: index.status !== TodoItemStatus.TODO}"
         :style="style" @click="_openTodoItemInfo()"
         @contextmenu="_openTodoItemSetting($event)">
        <a-typography-paragraph style="margin-top: 1rem" :ellipsis="ellipsis">
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
                <icon-arrow-up class="color-#fff"/>
            </div>
        </a-tooltip>
        <div class="more">
            <a-tooltip content="完成" v-if="only">
                <a-button type="text" status="success" @click.stop="onCheck()">
                    <template #icon>
                        <icon-check />
                    </template>
                </a-button>
            </a-tooltip>
            <a-button type="text" @click="_openTodoItemSetting($event)">
                <template #icon>
                    <icon-more />
                </template>
            </a-button>
        </div>
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
import {openTodoItemSetting} from "@/pages/todo/components/common/TodoItemSetting";
import {useTodoStore} from "@/store/components/TodoStore";
import {toDateString} from "xe-utils";
import {handleDate} from "@/utils/lang/ObjUtil";
import {openTodoItemInfo} from "@/pages/todo/components/common/TodoItemInfo";
import MessageUtil from "@/utils/modal/MessageUtil";

const props = defineProps({
    item: Object as PropType<TodoItemIndex>,
    attr: {
        type: Boolean,
        default: false
    },
    showTop: {
        type: Boolean,
        default: false
    },
    only: {
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


function _openTodoItemSetting(e: Event) {
    e.preventDefault();
    e.stopPropagation()
    if (!index.value) {
        return;
    }
    openTodoItemSetting(index.value, res => {
        index.value = res
        if (index.value) {
            initAttr(index.value.id);
            emits('update', index.value.id);
        }
    })
}

function _openTodoItemInfo() {
    if (!index.value) {
        return;
    }
    openTodoItemInfo(index.value)
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

function onCheck() {
    useTodoStore().updateById(index.value.id, {status: TodoItemStatus.COMPLETE})
        .then(() => MessageUtil.success("操作成功！"));
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
        right: 0;
        bottom: 0;
        background-color: rgb(var(--orange-6));
        color: var(--color-fill-2);
        clip-path: polygon(100% 0, 0 100% ,100% 100%);
        width: 25px;
        height: 25px;
        text-align: right;
        .arco-icon {
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }
    .more {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>
