<template>
  <div class="card-todo-item" :data-id="index.id" :draggable="!!groupId" @dragstart="handleDragstart"
       :class="{deleted: (index.status !== TodoItemStatus.TODO && index.status !== TodoItemStatus.DOING)}"
       @click="_openTodoItemSetting($event)" @contextmenu="onContextMenuForTodo($event, item!, onUpdate)">
    <div class="todo-item__main">
      <div class="todo-item__checkbox">
        <todo-item-checkbox :priority="index.priority" :status="index.status" @click.stop="onCheck(index)"/>
      </div>
      <div class="todo-item__title ellipsis-4">
        {{ index.title }}
      </div>
    </div>
    <todo-date :item class="todo-item__sub" />
    <div class="todo-item__tag" v-if="attr.tags.length > 0">
      <t-space size="small">
        <t-tag v-for="t in attr.tags" :key="t" :color="randomColor(t)" variant="outline">{{ t }}</t-tag>
      </t-space>
    </div>
    <t-tooltip content="置顶" v-if="index.top && index.status === TodoItemStatus.TODO">
      <div class="top">
        <caret-up-small-icon size="20px" class="icon"/>
      </div>
    </t-tooltip>
  </div>
</template>
<script lang="ts" setup>
import {
  getDefaultTodoItemAttr,
  getDefaultTodoItemIndex, getNextTodoItemStatus,
  TodoItemIndex,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";
import {handleDate, toDateTimeString} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {randomColor} from "@/utils/BrowserUtil";
import {onContextMenuForTodo} from "@/pages/todo/common/ContextMenuForTodo";
import {CaretUpSmallIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  },
  groupId: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update']);

const index = shallowRef(props.item || getDefaultTodoItemIndex());
const attr = ref(getDefaultTodoItemAttr());
const hasAttr = ref(false);
const start = ref('');
const end = ref('');


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
    }
  })
}

function initAttr(id: number) {
  hasAttr.value = false;
  useTodoItemStore().getTodoItemAttr(id)
    .then(res => {
      attr.value = res;
      if (attr.value.start !== '') {
        start.value = handleDate(attr.value.start);
        hasAttr.value = true;
      }
      if (attr.value.end !== '' && attr.value.start !== attr.value.end && attr.value.start !== '') {
        start.value = toDateTimeString(attr.value.start, "YYYY-MM-DD");
        end.value = toDateTimeString(attr.value.end, "YYYY-MM-DD");
        hasAttr.value = true;
      }
    })
}

if (index.value) {
  initAttr(index.value.id);
}

function onCheck(item: TodoItemIndex) {
  const newStatus = getNextTodoItemStatus(item.status);
  useTodoItemStore().updateById(item.id, {status: newStatus})
    .then(() => {
      item.status = newStatus
      MessageUtil.success("操作成功！")
      emit('update')
    });
}

function handleDragstart(e: DragEvent) {
  if (!props.groupId) {
    return;
  }
  e.dataTransfer?.setData('todo-item-id', props.item?.id + '');
  e.dataTransfer?.setData('todo-group-id', props.groupId);
}
</script>
<style scoped lang="less">
.card-todo-item {
  padding: 12px 16px;
  margin: 4px 0;
  cursor: pointer;
  position: relative;
  border-radius: var(--td-radius-default);
  background-color: var(--td-bg-color-container);
  transition: background-color 0.3s;
  border: 1px solid var(--td-border-level-2-color);

  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }

  &:active {
    background-color: var(--td-bg-color-container-active);
  }

  .todo-item__main {
    display: flex;
    align-items: flex-start;

    .todo-item__checkbox {
      margin-top: 2px;
    }

    .todo-item__title {
      margin: 0 0 0 8px;
    }
  }

  .todo-item__sub {
    margin-top: 4px;
  }

  .todo-item__tag {
    margin-top: 8px;
    margin-bottom: -8px;
  }

  &.deleted {
    color: var(--td-text-color-disabled);
    background-color: var(--td-bg-color-container-disabled);
  }


  .top {
    position: absolute;
    right: 0;
    top: 0;
    background-color: var(--td-warning-color);
    color: var(--td-bg-color-container);
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    width: 25px;
    height: 25px;
    text-align: right;

    .icon {
      position: absolute;
      top: -2px;
      right: -2px;
    }
  }

}
</style>
