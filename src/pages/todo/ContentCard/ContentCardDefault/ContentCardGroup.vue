<template>
  <div class="content-card-group" v-if="group" :class="{drag: isDrag}" @dragend="toggleDrag(false)"
       @drop="handleDrop"
       @dragenter="toggleDrag(true)" @dragover.stop="handleDragover" @dragleave="toggleDrag(false)">
    <header class="content-card-group__header">
      <div class="title">
        {{ group.name }}
        <t-tag class="length">{{ count }}</t-tag>
      </div>
      <div class="extra">
        <t-button variant="text" theme="primary" shape="square" @click="openAddTodoItem({group})">
          <template #icon>
            <plus-icon style="font-size: 24px;"/>
          </template>
        </t-button>
        <t-dropdown trigger="click">
          <t-button variant="text" theme="primary" shape="square">
            <template #icon>
              <ellipsis-icon style="font-size: 16px;"/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item @click="openEditTodoGroupFunc(group)">
              <template #prefix-icon>
                <edit2-icon/>
              </template>
              重命名
            </t-dropdown-item>
            <t-dropdown-item @click="openAddTodoGroupFunc(group.id, 0)">
              <template #prefix-icon>
                <arrow-left-down-icon/>
              </template>
              在左侧添加分组
            </t-dropdown-item>
            <t-dropdown-item @click="openAddTodoGroupFunc(group.id, 1)">
              <template #prefix-icon>
                <arrow-right-down-icon/>
              </template>
              在右侧添加分组
            </t-dropdown-item>
            <t-dropdown-item @click="openDeleteTodoGroupFunc(group.id, group.name)">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </div>
    </header>
    <div class="content-card-group__content">
      <content-card-priority v-for="priority in group.children" :key="priority.value" :priority-view="priority"
                             :group="group" :group-id="group.id"/>
      <content-card-complete :completes="group.complete" v-if="!hideOfCompleteOrAbandon"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import {
  openAddTodoGroupFunc,
  openDeleteTodoGroupFunc,
  openEditTodoGroupFunc
} from "@/pages/todo/common/TodoGroupFunc";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentCardPriority from "@/pages/todo/ContentCard/ContentCardDefault/ContentCardPriority.vue";
import ContentCardComplete from "@/pages/todo/ContentCard/components/ContentCardComplete.vue";
import {
  ArrowLeftDownIcon,
  ArrowRightDownIcon,
  DeleteIcon,
  Edit2Icon,
  EllipsisIcon,
  PlusIcon
} from "tdesign-icons-vue-next";

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
