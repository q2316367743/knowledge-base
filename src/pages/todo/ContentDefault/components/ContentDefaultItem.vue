<template>
  <div v-if="item" class="content-default-item"
       :class="itemId === item.id ? 'active' : ''"
       :key="item.id" @click.stop>
    <todo-item-checkbox :priority="item.priority" :status="item.status"
                        @click.stop="updateStatus(item.id, item.status)"/>
    <div class="title" @click="setItemId(item.id)" :style="{color: handleColor(item)}"
         @contextmenu="onContextMenuForTodo($event, item)">
      {{ item.title }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  handlePriorityColor,
  TodoItemIndex,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {onContextMenuForTodo, updateStatus} from "@/pages/todo/common/ContextMenuForTodo";

defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  }
});

const itemId = computed(() => useTodoWrapStore().itemId);
const setItemId = (e: number) => useTodoWrapStore().setItemId(e);
const handleColor = (item: TodoItemIndex): string => {
  if (item.status === TodoItemStatus.COMPLETE || item.status === TodoItemStatus.ABANDON) {
    return 'var(--td-text-color-primary)';
  }
  return handlePriorityColor(item.priority);
};
</script>
<style scoped lang="less">
.content-default-item {
  position: relative;
  padding: 4px 7px;
  border-bottom: 1px solid var(--td-border-level-2-color);
  display: grid;
  grid-template-columns: 30px 1fr 32px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;

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
}
</style>
