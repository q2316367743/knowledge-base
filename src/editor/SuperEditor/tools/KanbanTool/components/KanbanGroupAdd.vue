<template>
  <div class="kanban-group-add w-fit h-fit flex items-center mt-4" @click="onAdd">
    <plus-icon size="24px"/>
    <div class="ml-1">添加分组</div>
  </div>
</template>
<script lang="ts" setup>
import {PlusIcon} from "tdesign-icons-vue-next";
import {postGroup} from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanGroupPost";
import {IKanbanInstance, KanbanInstance} from "@/editor/SuperEditor/tools/KanbanTool/types";

const instance = inject<IKanbanInstance>(KanbanInstance);

function onAdd() {
  postGroup(undefined, instance);
}
</script>
<style scoped lang="less">
.kanban-group-add {
  padding: 4px 12px 4px 8px;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: var(--td-radius-default);

  &:hover {
    background-color: var(--td-bg-color-container-hover);
  }
}
</style>
