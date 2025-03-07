<template>
  <div class="kanban-group" v-if="group">
    <div class="kanban-group-header flex justify-between items-center">
      <t-space class="kanban-group-header-name flex items-center">
        <t-tag :color="group.color" variant="light">{{ group.name }}</t-tag>
        <div class="kanban-group-header-count">{{ group.nodes.length }}</div>
      </t-space>
      <div class="kanban-group-header-option flex items-center" v-if="!readOnly">
        <t-button theme="primary" variant="text" size="small" shape="square" @click="openKanbanNodePost(group.id, undefined, instance)">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
        <t-button theme="primary" variant="text" size="small" shape="square">
          <template #icon>
            <more-icon/>
          </template>
        </t-button>
      </div>
    </div>
    <kanban-group-container v-model="group.nodes" :read-only="readOnly" :group-id="group.id"/>
  </div>
</template>
<script lang="ts" setup>
import {IKanbanInstance, KanbanDataGroup, KanbanInstance} from "@/editor/SuperEditor/tools/KanbanTool/types";
import {MoreIcon, PlusIcon} from "tdesign-icons-vue-next";
import KanbanGroupContainer from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanGroupContainer.vue";
import {openKanbanNodePost} from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanNodePost";

const group = defineModel({
  type: Object as PropType<KanbanDataGroup>,
});
defineProps({
  readOnly: {
    type: Boolean,
    default: false
  }
});

const instance = inject<IKanbanInstance>(KanbanInstance);
</script>
<style scoped lang="less">
.kanban-group {
  width: 280px;
  height: 100%;
  overflow: auto;

  .kanban-group-header {
    height: 40px;
    user-select: none;

    .kanban-group-header-count {
      color: var(--td-text-color-secondary);
    }
  }

}
</style>
