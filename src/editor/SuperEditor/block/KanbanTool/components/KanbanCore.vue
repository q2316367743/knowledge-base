<template>
  <div class="kanban-core w-full h-full" ref="el">
    <kanban-group v-for="group in groups" :group="group" :key="group?.id"
                  :read-only="readOnly"/>
    <kanban-group-add />
  </div>
</template>
<script lang="ts" setup>
import {KanbanDataGroup} from "@/editor/SuperEditor/block/KanbanTool/types";
import KanbanGroup from "@/editor/SuperEditor/block/KanbanTool/components/KanbanGroup.vue";
import {useSortable} from "@vueuse/integrations/useSortable";
import KanbanGroupAdd from "@/editor/SuperEditor/block/KanbanTool/components/KanbanGroupAdd.vue";

const groups = defineModel({
  type: Object as PropType<Array<KanbanDataGroup>>,
  default: () => ([])
});

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  }
});

const el = ref();

const sortable = useSortable(el, groups, {
  animation: 150,
  handle: '.kanban-group-header',
});

onMounted(() => {
  if (props.readOnly) {
    sortable.stop();
  }
});
</script>
<style scoped lang="less">
.kanban-core {
  display: grid;
  grid-auto-flow: column; /* 横向排列 */
  grid-auto-columns: 280px; /* 每个子项宽度 */
  gap: 16px; /* 可选间隙 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动 */
  padding: 0 16px;
  width: calc(100% - 32px);
}
</style>
