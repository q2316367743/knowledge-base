<template>
  <div class="quadrant-card" @dragover.prevent="onDragOver($event)" @drop.prevent="onDrop($event)">
    <header class="quadrant-header">
      <div class="title" :style="{color: quadrant.color}">
        {{ quadrant.title }}
        <t-tag class="count">{{ quadrant.items.length }}</t-tag>
      </div>
      <div class="extra">
        <t-space size="small">
          <t-button variant="text" theme="primary" shape="square"
                    @click="openAddTodoItem({priority: quadrant.priority})">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </t-space>
      </div>
    </header>
    <div class="quadrant-content" :class="{'drag-over': isDragOver}">
      <!-- 置顶待办项折叠面板 -->
      <collapsible-panel
        v-if="topItems.length > 0"
        title="已置顶"
        :count="topItems.length"
        :collapsed="isTopCollapsed"
        panel-class="top-panel"
        @toggle="$emit('toggle-top-collapse')">
        <todo-item
          v-for="item in topItems"
          :key="item.id"
          :item="item"
          @click="openTodoItemSetting(item)"
          @context-menu="onContextMenuForTodo($event, item)"
          @drag-start="onDragStart($event, item)"
          @drag-end="onDragEnd"
          @check="onCheck"/>
      </collapsible-panel>

      <!-- 普通活动待办项 -->
      <!-- 当有置顶项或已完成项时显示折叠面板 -->
      <collapsible-panel
        v-if="normalActiveItems.length > 0 && (topItems.length > 0 || completedItems.length > 0)"
        title="待办项"
        :count="normalActiveItems.length"
        :collapsed="isNormalCollapsed"
        panel-class="normal-panel"
        @toggle="$emit('toggle-normal-collapse')">
        <todo-item
          v-for="item in normalActiveItems"
          :key="item.id"
          :item="item"
          @click="openTodoItemSetting(item)"
          @context-menu="onContextMenuForTodo($event, item)"
          @drag-start="onDragStart($event, item)"
          @drag-end="onDragEnd"
          @check="onCheck"/>
      </collapsible-panel>

      <!-- 当没有置顶项和已完成项时直接显示普通待办项 -->
      <div v-if="normalActiveItems.length > 0 && topItems.length === 0 && completedItems.length === 0">
        <todo-item
          v-for="item in normalActiveItems"
          :key="item.id"
          :item="item"
          @click="openTodoItemSetting(item)"
          @context-menu="onContextMenuForTodo($event, item)"
          @drag-start="onDragStart($event, item)"
          @drag-end="onDragEnd"
          @check="onCheck"/>
      </div>

      <!-- 已完成和已放弃的待办项折叠面板 -->
      <collapsible-panel
        v-if="completedItems.length > 0"
        title="已完成/已放弃"
        :count="completedItems.length"
        :collapsed="isCollapsed"
        @toggle="$emit('toggle-collapse')">
        <todo-item
          v-for="item in completedItems"
          :key="item.id"
          :item="item"
          :show-top-button="false"
          @click="openTodoItemSetting(item)"
          @context-menu="onContextMenuForTodo($event, item)"
          @drag-start="onDragStart($event, item)"
          @drag-end="onDragEnd"
          @check="onCheck"/>
      </collapsible-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {TodoItemIndex, TodoItemPriority, TodoItemStatus, getNextTodoItemStatus} from "@/entity/todo/TodoItem";
import {PlusIcon} from "tdesign-icons-vue-next";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {onContextMenuForTodo} from "@/pages/todo/common/ContextMenuForTodo";
import {useTodoItemStore, useTodoWrapStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import TodoItem from "./TodoItem.vue";
import CollapsiblePanel from "./CollapsiblePanel.vue";

interface Quadrant {
  title: string;
  color: string;
  items: Array<TodoItemIndex>;
  priority: TodoItemPriority;
}

interface Props {
  quadrant: Quadrant;
  isCollapsed: boolean;
  isTopCollapsed: boolean;
  isNormalCollapsed: boolean;
  draggedItem: TodoItemIndex | null;
  isDragOverQuadrant: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggle-collapse'): void;
  (e: 'toggle-top-collapse'): void;
  (e: 'toggle-normal-collapse'): void;
  (e: 'drag-start', item: TodoItemIndex): void;
  (e: 'drag-end'): void;
  (e: 'drag-over'): void;
  (e: 'drop', quadrant: Quadrant): void;
}>();

// 获取置顶待办项
const topItems = computed(() => {
  return props.quadrant.items.filter(item =>
    item.top &&
    (item.status === TodoItemStatus.TODO ||
      item.status === TodoItemStatus.DOING)
  );
});

// 获取普通活动待办项（未完成和进行中，且非置顶）
const normalActiveItems = computed(() => {
  return props.quadrant.items.filter(item =>
    !item.top &&
    (item.status === TodoItemStatus.TODO ||
      item.status === TodoItemStatus.DOING)
  );
});

// 获取已完成和已放弃的待办项
const completedItems = computed(() => {
  const {hideOfCompleteOrAbandon} = useTodoWrapStore();
  if (hideOfCompleteOrAbandon) return [];
  return props.quadrant.items.filter(item =>
    item.status === TodoItemStatus.COMPLETE ||
    item.status === TodoItemStatus.ABANDON
  );
});

// 处理待办事项状态变更
function onCheck(item: TodoItemIndex) {
  const nextStatus = getNextTodoItemStatus(item.status);
  useTodoItemStore().updateById(item.id, {status: nextStatus})
    .then(() => {
      if (nextStatus === TodoItemStatus.COMPLETE) {
        MessageUtil.success('恭喜你完成了一项任务！');
      }
    });
}

// 拖拽相关状态和方法
const isDragOver = computed(() => props.isDragOverQuadrant);

// 开始拖拽时触发
function onDragStart(event: DragEvent, item: TodoItemIndex) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.id.toString());

    // 添加拖拽时的视觉效果
    if (event.target instanceof HTMLElement) {
      event.target.classList.add('dragging');
    }

    emit('drag-start', item);
  }
}

// 拖拽结束时触发
function onDragEnd(event: DragEvent) {
  if (event.target instanceof HTMLElement) {
    event.target.classList.remove('dragging');
  }
  emit('drag-end');
}

// 拖拽经过目标区域时触发
function onDragOver(_event: DragEvent) {
  if (props.draggedItem && props.draggedItem.priority !== props.quadrant.priority) {
    emit('drag-over');
  }
}

// 放置时触发
function onDrop(_event: DragEvent) {
  emit('drop', props.quadrant);
}
</script>

<style scoped lang="less">
.quadrant-card {
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--border-radius-medium);
  background-color: var(--kb-bg-color-3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .quadrant-header {
    padding: 6px 8px 6px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--td-component-stroke);

    .title {
      font-weight: bold;
      font-size: 16px;
      display: flex;
      align-items: center;

      .count {
        margin-left: 8px;
        font-weight: normal;
        font-size: 12px;
      }
    }

    .extra {
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    &:hover .extra {
      opacity: 1;
    }
  }

  .quadrant-content {
    flex: 1;
    overflow: auto;
    padding: 6px 8px;
    transition: background-color 0.2s ease;

    &.drag-over {
      background-color: var(--td-bg-color-container-select);
    }
  }
}
</style>