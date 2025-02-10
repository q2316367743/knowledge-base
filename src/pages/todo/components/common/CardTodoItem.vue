<template>
  <div class="card-todo-item" :data-id="index.id" draggable="true" @dragstart="handleDragstart"
       :class="{deleted: (index.status !== TodoItemStatus.TODO && index.status !== TodoItemStatus.DOING)}"
       @click="_openTodoItemSetting($event)">
    <div class="todo-item__main">
      <div class="todo-item__checkbox">
        <todo-item-checkbox :priority="index.priority" :status="index.status" @click.stop="onCheck(index)"/>
      </div>
      <a-typography-paragraph class="todo-item__title" :ellipsis="ellipsis">
        {{ index.title }}
      </a-typography-paragraph>
    </div>
    <div v-if="hasAttr" class="todo-item__sub">
      <a-tag color="arcoblue" size="small" bordered>
        <template #icon>
          <icon-clock-circle/>
        </template>
        {{ start }}{{ end ? ' · ' + end : '' }}
      </a-tag>
    </div>
    <div class="todo-item__tag" v-if="info.content.record.tags.length > 0">
      <a-space wrap>
        <a-tag v-for="t in info.content.record.tags" :key="t" :color="randomColor(t)" bordered>{{ t }}</a-tag>
      </a-space>
    </div>
    <a-tooltip content="置顶" v-if="index.top && index.status === TodoItemStatus.TODO">
      <div class="top">
        <icon-arrow-up class="color-#fff"/>
      </div>
    </a-tooltip>
  </div>
</template>
<script lang="ts" setup>
import {
  getDefaultTodoItem,
  getDefaultTodoItemIndex, getNextTodoItemStatus,
  TodoItemIndex,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {openTodoItemSetting} from "@/pages/todo/components/common/TodoItemSetting/model";
import {handleDate, toDateString} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {randomColor} from "@/utils/BrowserUtil";

const props = defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  },
  groupId: {
    type: String,
    default: ''
  }
});

const ellipsis = {
  rows: 3,
  expandable: true,
};

const index = shallowRef(props.item || getDefaultTodoItemIndex());
const info = ref(getDefaultTodoItem());
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
  useTodoItemStore().getTodoItem(id)
    .then(res => {
      info.value = res;
      const {attr} = res;
      if (attr.start !== '') {
        start.value = handleDate(attr.start);
        hasAttr.value = true;
      }
      if (attr.end !== '' && attr.start !== attr.end && attr.start !== '') {
        start.value = toDateString(attr.start, "YYYY-MM-DD");
        end.value = toDateString(attr.end, "YYYY-MM-DD");
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
    });
}

function handleDragstart(e: DragEvent) {
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
  border-radius: var(--border-radius-medium);
  background-color: var(--color-bg-1);
  transition: background-color 0.3s;
  border: 1px solid var(--color-border-2);

  &:hover {
    background-color: var(--color-fill-1);
  }

  &:active {
    background-color: var(--color-fill-2);
  }

  .todo-item__main {
    display: flex;
    align-items: flex-start;

    .todo-item__checkbox {
      margin-top: 4px;
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
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
    width: 25px;
    height: 25px;
    text-align: right;

    .arco-icon {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

}
</style>
