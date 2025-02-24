<template>
  <div class="content-card-group" v-if="group" :class="{drag: isDrag}" @dragend="toggleDrag(false)"
       @drop="handleDrop"
       @dragenter="toggleDrag(true)" @dragover.stop="handleDragover" @dragleave="toggleDrag(false)">
    <header class="content-card-group__header">
      <div class="title">
        {{ group.name }}
        <a-tag class="length">{{ count }}</a-tag>
      </div>
      <div class="extra">
        <a-button type="text" @click="openAddTodoItem(group)">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
        <a-dropdown>
          <a-button type="text">
            <template #icon>
              <icon-more/>
            </template>
          </a-button>
          <template #content>
            <a-doption @click="openEditTodoGroupFunc(group)">
              <template #icon>
                <icon-edit/>
              </template>
              重命名
            </a-doption>
            <a-doption @click="openAddTodoGroupFunc(group.id, 0)">
              <template #icon>
                <icon-rotate-left/>
              </template>
              在左侧添加分组
            </a-doption>
            <a-doption @click="openAddTodoGroupFunc(group.id, 1)">
              <template #icon>
                <icon-rotate-right/>
              </template>
              在右侧添加分组
            </a-doption>
            <a-doption @click="openDeleteTodoGroupFunc(group.id, group.name)">
              <template #icon>
                <icon-delete/>
              </template>
              删除
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </header>
    <div class="content-card-group__content">
      <todo-item-priority v-for="priority in group.children" :key="priority.value" :priority-view="priority"
                          :group="group" :group-id="group.id"/>
      <todo-item-complete :completes="group.complete" v-if="!hideOfCompleteOrAbandon"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {
  openAddTodoGroupFunc,
  openDeleteTodoGroupFunc,
  openEditTodoGroupFunc
} from "@/pages/todo/components/func/TodoGroupFunc";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import TodoItemPriority from "@/pages/todo/components/common/TodoItemPriority.vue";
import TodoItemComplete from "@/pages/todo/components/common/TodoItemComplete.vue";

const props = defineProps({
  group: {
    type: Object as PropType<TodoGroupView>
  }
});
const count = computed(() => {
  const {group} = props;
  let c = 0;
  if (group) {
    group.children.forEach(item => {
      c += item.children.length;
    });
  }
  return c;
});
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);

const isDrag = ref(false);

const toggleDrag = useToggle(isDrag);

function handleDragover(e: DragEvent) {
  e.preventDefault();
  e.stopPropagation();
  toggleDrag(true)
}

function handleDrop(e: DragEvent) {
  const {dataTransfer} = e;
  if (dataTransfer) {
    const todoItemId = dataTransfer.getData('todo-item-id');
    const todoGroupId = dataTransfer.getData('todo-group-id');
    useTodoGroupStore().moveTo(todoGroupId, props.group!.id, Number(todoItemId))
  }
  toggleDrag(false)
}
</script>
<style scoped lang="less">
.content-card-group {
  width: 256px;
  height: calc(100vh - 40px);
  margin: 7px 8px;
  border-radius: var(--border-radius-medium);
  position: relative;
  border: 2px solid transparent;
  padding: 0 4px;

  &.drag {
    border-color: rgb(var(--arcoblue-4));
  }

  .content-card-group__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .title {
      padding: 8px 8px;
      font-weight: bold;

      .length {
        font-weight: normal;
        font-size: 0.8rem;
        margin-left: 4px;
      }
    }
  }

  .content-card-group__content {
    margin-top: 8px;
    height: calc(100% - 54px);
    overflow: auto;
  }
}
</style>
