<template>
  <div v-if="item" class="content-default-item"
       :class="itemId === item.id ? 'active' : ''"
       :key="item.id" @click.stop @contextmenu="onContextMenuForTodo($event, item)">
    <div class="flex">
      <todo-item-checkbox :priority="item.priority" :status="item.status"
                          @click.stop="updateStatus(item.id, item.status)"/>
      <div class="title" @click="setItemId(item.id)" :style="{color: handleTodoTitleColor(item)}">
        {{ item.title }}
      </div>
    </div>
    <todo-date class="date" :item="item"/>
  </div>
</template>
<script lang="ts" setup>
import {
  handleTodoTitleColor,
  TodoItemIndex,
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


</script>
<style scoped lang="less">
.content-default-item {
  position: relative;
  padding: 4px 7px;
  border-bottom: 1px solid var(--td-border-level-2-color);
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  justify-content: space-between;

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
    margin-left: 6px;
  }

  .date {
    font-size: var(--td-font-size-body-small);
    align-items: flex-end;
  }
}
</style>
