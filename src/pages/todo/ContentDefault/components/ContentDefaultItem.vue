<template>
  <div v-if="item" class="content-default-item"
       :class="itemId === item.id ? 'active' : ''"
       :key="item.id" @click.stop @contextmenu="onContextMenuForTodo($event, item, toUpdate)">
    <todo-item-checkbox :priority="item.priority" :status="item.status"
                        @click.stop="updateStatus(item.id, item.status)"/>
    <div class="title" @click="setItemId(item.id)" :style="{color: handleTodoTitleColor(item)}">
      {{ item.title }}
    </div>
    <div v-if="date.status > 0" class="date"
         :style="{color: date.status === 1 ? 'var(--td-brand-color)' :  'var(--td-error-color)'}">
      {{ date.text }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from "dayjs";
import {
  handleTodoTitleColor,
  TodoItemIndex, TodoItemStatus,
} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {onContextMenuForTodo, updateStatus} from "@/pages/todo/common/ContextMenuForTodo";
import {useTodoItemStore} from "@/store";

const props = defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  }
});

interface TodoDate {
  text: string;
  status: 0 | 1 | 2
}

const date = ref<TodoDate>({
  // 0,1,2:过期
  status: 0,
  text: ''
});

const itemId = computed(() => useTodoWrapStore().itemId);
const setItemId = (e: number) => useTodoWrapStore().setItemId(e);

function onUpdate() {
  const {item} = props;
  if (!item) {
    date.value = {status: 0, text: ''};
    return;
  }
  const {id, status} = item;
  if (status === TodoItemStatus.COMPLETE || status === TodoItemStatus.ABANDON) {
    date.value = {status: 0, text: ''};
    return;
  }
  useTodoItemStore().getTodoItemAttr(id).then(res => {
    if (!res.start) {
      date.value = {status: 0, text: ''};
      return;
    }
    const now = dayjs();
    const start = dayjs(res.start);
    const end = dayjs(res.end || res.start);
    if (now.diff(start, 'day') === 0) {
      // 就是今天
      date.value = {status: 1, text: '今天'};
    } else if (now.isBefore(start, 'day')) {
      // 判断开始时间是不是今天之后
      if (now.diff(start, 'week') === 1) {
        // 如果是下周，则显示下周几，需要加上这已经过去的天数
        date.value = {status: 1, text: start.format('ddd')};
      } else if (now.diff(start, 'year') === 0) {
        // 如果是今年内，则显示几月几日，需要加上今年的天数
        date.value = {status: 1, text: start.format('MM-DD')};
      } else {
        // 如果是明年以后则直接显示日期
        date.value = {status: 1, text: start.format('YYYY-MM-DD')};
      }
    } else {
      if (end.isBefore(now, 'day')) {
        // 结束时间在今天之前，已过期
        date.value = {status: 2, text: start.format('MM-DD')};
      } else {
        const endDiff = end.diff(now, 'day');
        if (endDiff === 0) {
          date.value = {status: 1, text: '今天'};
        } else if (endDiff === 1) {
          date.value = {status: 1, text: '昨天'};
        } else if (now.diff(start, 'year') === 0) {
          // 今年内
          date.value = {status: 1, text: start.format('MM-DD')};
        } else {
          // 如果是明年以后则直接显示日期
          date.value = {status: 1, text: start.format('YYYY-MM-DD')};
        }
      }
    }
  });
}

watch(() => props.item, async val => {
  if (!val) {
    date.value = {status: 0, text: ''};
    return;
  }
  onUpdate();
}, {immediate: true});

const toUpdate = () => onUpdate();
</script>
<style scoped lang="less">
.content-default-item {
  position: relative;
  padding: 4px 7px;
  border-bottom: 1px solid var(--td-border-level-2-color);
  display: grid;
  grid-template-columns: 30px 1fr 36px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: 1px solid transparent;
  }

  &:hover {
    background-color: var(--td-bg-color-component-hover);
  }

  &.active {
    background-color: var(--td-bg-color-component-active);
  }

  .delete {
    text-decoration: line-through;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date {
    font-size: var(--td-font-size-body-small);
  }
}
</style>
