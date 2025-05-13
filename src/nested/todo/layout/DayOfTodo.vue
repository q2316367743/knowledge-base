<template>
  <div class="todo-list">
    <template v-if="todayItems.length > 0">
      <div
        v-for="item in todayItems"
        :key="item.index.id"
        class="todo-item"
        :class="{'completed': item.index.status === TodoItemStatus.COMPLETE}"
        @contextmenu="onContextMenu($event, item.index)"
      >
        <div class="todo-checkbox">
          <todo-item-checkbox :priority="item.index.priority" :status="item.index.status"
                              @click.stop="onCheck(item.index)"/>
        </div>
        <div class="todo-content">
          <div class="todo-title">{{ item.index.title }}</div>
        </div>
        <div class="top-indicator" v-if="item.index.top">
          <arrow-triangle-up-filled-icon/>
        </div>
      </div>
    </template>
    <div class="empty-state" v-else>
      <t-empty description="今日暂无待办"/>
      <t-button theme="primary" @click="addTodo">添加待办</t-button>
    </div>

    <div class="add-todo">
      <t-button theme="primary" shape="circle" @click="addTodo">
        <template #icon>
          <plus-icon/>
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemStatus, TodoItemIndex, getNextTodoItemStatus} from "@/entity/todo/TodoItem";
import {ArrowTriangleUpFilledIcon, PlusIcon} from "tdesign-icons-vue-next";
import {onContextMenuForTodo} from "@/pages/todo/common/ContextMenuForTodo";
import {useTodoItemStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {currentDay, refresh, todayItems, updateTodayItems} from "@/nested/todo/store";
import TodoItemCheckbox from "@/components/TodoItemCheckbox/TodoItemCheckbox.vue";


function onCheck(item: TodoItemIndex) {
  const nextStatus = getNextTodoItemStatus(item.status);
  useTodoItemStore().updateById(item.id, {status: nextStatus})
    .then(() => {
      if (nextStatus === TodoItemStatus.COMPLETE) {
        MessageUtil.success('恭喜你完成了一项任务！');
      }
      // 成功后刷新今日状态
      updateTodayItems()
    });
}

const onContextMenu = (e: MouseEvent, item: TodoItemIndex) => {
  onContextMenuForTodo(e, item, refresh);
}


// 添加待办
function addTodo() {
  openAddTodoItem({
    start: currentDay.value,
    onAdd: refresh
  });
}

</script>
<style scoped lang="less">
.todo-list {
  flex: 1;
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  margin-bottom: 16px;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--td-shadow-1);

  .todo-item {
    display: flex;
    padding: 12px 8px 8px;
    border-bottom: 1px solid var(--td-border-level-1-color);
    align-items: center;
    position: relative;
    transition: background-color 0.3s;

    &:hover{
      background-color: var(--td-bg-color-component-hover);
    }

    &.completed {
      opacity: 0.6;

      .todo-title {
        text-decoration: line-through;
      }
    }

    .todo-checkbox {
      margin-right: 12px;
    }

    .todo-content {
      flex: 1;
    }

    .todo-title {
      font-size: var(--td-font-size-body-medium);
      margin-bottom: 4px;
    }

    .todo-time {
      font-size: var(--td-font-size-body-small);
      color: var(--td-text-color-secondary);
    }

    .top-indicator {
      position: absolute;
      top: 10px;
      right: 8px;
      color: var(--td-warning-color);
      font-size: 16px;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: var(--td-comp-margin-m);
  }

  .add-todo {
    position: absolute;
    bottom: 24px;
    right: 24px;
  }
}
</style>
