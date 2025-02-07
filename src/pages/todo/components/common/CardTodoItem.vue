<template>
  <div class="card-todo-item"
       :class="{deleted: (index.status !== TodoItemStatus.TODO && index.status !== TodoItemStatus.DOING)}"
       @click="_openTodoItemSetting($event)">
    <div class="todo-item__main">
      <todo-item-checkbox :priority="index.priority" :status="index.status" @click.stop="onCheck(index)"/>
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
    <a-tooltip content="置顶" v-if="(index.top && index.status === TodoItemStatus.TODO) || props.showTop">
      <div class="top">
        <icon-arrow-up class="color-#fff"/>
      </div>
    </a-tooltip>
  </div>
</template>
<script lang="ts" setup>
import {
  getDefaultTodoItemAttr,
  getDefaultTodoItemIndex, getNextTodoItemStatus,
  TodoItemIndex,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {openTodoItemSetting} from "@/pages/todo/components/common/TodoItemSetting";
import {handleDate, toDateString} from "@/utils/lang/FormatUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoItemStore} from "@/store/db/TodoItemStore";

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

function initAttr(id: number) {
  hasAttr.value = false;
  useTodoItemStore().getTodoItemAttr(id)
    .then(res => {
      attr.value = res;
      if (res.start !== '') {
        start.value = handleDate(res.start);
        hasAttr.value = true;
      }
      if (res.end !== '' && res.start !== res.end && res.start !== '') {
        start.value = toDateString(res.start, "YYYY-MM-DD");
        end.value = toDateString(res.end, "YYYY-MM-DD");
        hasAttr.value = true;
      }

    })

}

if (props.attr && index.value) {
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

</script>
<style scoped lang="less">
.card-todo-item {
  padding: 12px 16px;
  margin: 4px 0;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
  border-radius: var(--border-radius-large);
  background-color: var(--color-bg-1);
  transition: background-color 0.3s;
  border: 1px solid var(--color-border-1);

  &:hover {
    background-color: var(--color-fill-2);
  }

  .todo-item__main {
    display: flex;

    .todo-item__title {
      margin: 0 0 0 8px;
    }
  }

  .todo-item__sub {
    margin-top: 4px;
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
