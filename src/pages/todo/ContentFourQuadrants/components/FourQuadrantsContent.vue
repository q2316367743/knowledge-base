<template>
  <div class="four-quadrants-content">
    <quadrant-card 
      v-for="(quadrant, index) in quadrants" 
      :key="index" 
      :quadrant="quadrant"
      :is-collapsed="isCollapsed(index)"
      :is-top-collapsed="isTopCollapsed(index)"
      :is-normal-collapsed="isNormalCollapsed(index)"
      :dragged-item="draggedItem"
      :is-drag-over-quadrant="isDragOver && dragOverQuadrant === quadrant.priority"
      @toggle-collapse="toggleCollapse(index)"
      @toggle-top-collapse="toggleTopCollapse(index)"
      @toggle-normal-collapse="toggleNormalCollapse(index)"
      @drag-start="onDragStart($event)"
      @drag-end="onDragEnd"
      @drag-over="onDragOver(quadrant)"
      @drop="onDrop(quadrant)"
    />
  </div>
</template>

<script lang="ts" setup>
import { useTodoItemStore } from "@/store";
import { group } from "@/utils/lang/ArrayUtil";
import {
  handleSimplePriorityColor,
  TodoItemIndex,
  TodoItemPriority,
} from "@/entity/todo/TodoItem";
import QuadrantCard from "./QuadrantCard.vue";

interface Quadrant {
  title: string;
  color: string;
  items: Array<TodoItemIndex>;
  priority: TodoItemPriority;
}

const priorityMap = computed(() => {
  const { items } = useTodoItemStore();
  const result: Map<TodoItemPriority, Array<TodoItemIndex>> = group(items, 'priority');
  for (const v of result.values()) {
    v.sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0));
  }
  return result;
});

// 假设优先级顺序为：1-重要且紧急，2-重要不紧急，3-不重要但紧急，4-不重要不紧急
const quadrants = computed<Array<Quadrant>>(() => {
  const quadrantsData = [
    { title: '重要且紧急', priority: TodoItemPriority.HIGH, color: handleSimplePriorityColor(TodoItemPriority.HIGH) },
    { title: '重要不紧急', priority: TodoItemPriority.MIDDLE, color: handleSimplePriorityColor(TodoItemPriority.MIDDLE) },
    { title: '不重要但紧急', priority: TodoItemPriority.FLOOR, color: handleSimplePriorityColor(TodoItemPriority.FLOOR) },
    { title: '不重要不紧急', priority: TodoItemPriority.NONE, color: handleSimplePriorityColor(TodoItemPriority.NONE) },
  ];

  return quadrantsData.map(quadrant => ({
    ...quadrant,
    items: priorityMap.value.get(quadrant.priority) || [],
  }));
});

// 折叠面板状态管理
const collapsedPanels = ref<Set<number>>(new Set());
const topCollapsedPanels = ref<Set<number>>(new Set());
const normalCollapsedPanels = ref<Set<number>>(new Set());

function toggleCollapse(index: number) {
  if (isCollapsed(index)) {
    collapsedPanels.value.delete(index);
  } else {
    collapsedPanels.value.add(index);
  }
}

function isCollapsed(index: number): boolean {
  return collapsedPanels.value.has(index);
}

// 置顶项折叠面板状态管理
function toggleTopCollapse(index: number) {
  if (isTopCollapsed(index)) {
    topCollapsedPanels.value.delete(index);
  } else {
    topCollapsedPanels.value.add(index);
  }
}

function isTopCollapsed(index: number): boolean {
  return topCollapsedPanels.value.has(index);
}

// 普通活动项折叠面板状态管理
function toggleNormalCollapse(index: number) {
  if (isNormalCollapsed(index)) {
    normalCollapsedPanels.value.delete(index);
  } else {
    normalCollapsedPanels.value.add(index);
  }
}

function isNormalCollapsed(index: number): boolean {
  return normalCollapsedPanels.value.has(index);
}

// 拖拽相关状态和方法
const draggedItem = ref<TodoItemIndex | null>(null);
const isDragOver = ref(false);
const dragOverQuadrant = ref<TodoItemPriority | null>(null);

// 开始拖拽时触发
function onDragStart(item: TodoItemIndex) {
  draggedItem.value = item;
}

// 拖拽结束时触发
function onDragEnd() {
  isDragOver.value = false;
  dragOverQuadrant.value = null;
}

// 拖拽经过目标区域时触发
function onDragOver(quadrant: Quadrant) {
  if (draggedItem.value && draggedItem.value.priority !== quadrant.priority) {
    isDragOver.value = true;
    dragOverQuadrant.value = quadrant.priority;
  }
}

// 放置时触发
function onDrop(quadrant: Quadrant) {
  if (!draggedItem.value) return;
  
  const itemId = draggedItem.value.id;
  const newPriority = quadrant.priority;
  
  // 如果优先级不同，则更新待办项的优先级
  if (draggedItem.value.priority !== newPriority) {
    useTodoItemStore().updateById(itemId, { priority: newPriority });
  }
  
  isDragOver.value = false;
  dragOverQuadrant.value = null;
  draggedItem.value = null;
}
</script>

<style scoped lang="less">
.four-quadrants-content {
  width: calc(100% - 16px);
  height: calc(100% - 8px);
  padding: 0 8px 8px;

  display: grid;
  grid-template-rows: repeat(2, 1fr); // 两行
  grid-template-columns: repeat(2, 1fr); // 两列
  gap: 8px;
}
</style>