<template>
  <div class="kanban-node" v-if="node">
    {{ node.name }}
  </div>
</template>
<script lang="ts" setup>
import {KanbanDataNode} from "@/editor/SuperEditor/tools/KanbanTool/types";

const node = defineModel({
  type: Object as PropType<KanbanDataNode>,
  required: true
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped lang="less">
.kanban-node {
  padding: 16px 12px;
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-medium);
  cursor: pointer;
  margin-top: 8px;
  background-color: var(--td-bg-color-container);
  transition: all 0.3s;

  &:hover {
    border-color: var(--td-border-level-2-color);
    background-color: var(--td-bg-color-container-hover);
  }
}
</style>
