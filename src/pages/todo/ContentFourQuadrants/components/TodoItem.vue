<template>
  <div class="todo-item" :class="{'top-item': item.top, 'completed-item': isCompleted}"
       @click="$emit('click', item)" @contextmenu="$emit('context-menu', $event, item)"
       draggable="true" @dragstart="$emit('drag-start', $event, item)" @dragend="$emit('drag-end', $event)">
    <div class="todo-item__main">
      <div class="todo-item__checkbox">
        <todo-item-checkbox :priority="item.priority" :status="item.status" @click.stop="$emit('check', item)"/>
      </div>
      <div class="todo-item__title ellipsis-2">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { TodoItemIndex, TodoItemStatus } from "@/entity/todo/TodoItem";
import TodoItemCheckbox from "@/components/TodoItemCheckbox/TodoItemCheckbox.vue";

interface Props {
  item: TodoItemIndex;
  showTopButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTopButton: true
});

const isCompleted = computed(() => {
  return props.item.status === TodoItemStatus.COMPLETE || 
         props.item.status === TodoItemStatus.ABANDON;
});

defineEmits<{
  (e: 'click', item: TodoItemIndex): void;
  (e: 'context-menu', event: MouseEvent, item: TodoItemIndex): void;
  (e: 'drag-start', event: DragEvent, item: TodoItemIndex): void;
  (e: 'drag-end', event: DragEvent): void;
  (e: 'check', item: TodoItemIndex): void;
}>();
</script>

<style scoped lang="less">
.todo-item {
  position: relative;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: var(--border-radius-small);
  background-color: var(--td-bg-color-container-hover);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background-color: var(--td-bg-color-container-active);
  }
  
  &.dragging {
    opacity: 0.5;
    transform: scale(0.98);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  &.completed-item {
    opacity: 0.8;
  }

  &.top-item {
    border-left: 3px solid var(--td-warning-color);
  }

  .todo-item__main {
    display: flex;
    align-items: flex-start;

    .todo-item__checkbox {
      margin-right: 8px;
      margin-top: 2px;
    }

    .todo-item__title {
      flex: 1;
      word-break: break-all;
    }
  }

  .top {
    position: absolute;
    top: 4px;
    right: 4px;
    color: var(--td-brand-color);
  }
}
</style>