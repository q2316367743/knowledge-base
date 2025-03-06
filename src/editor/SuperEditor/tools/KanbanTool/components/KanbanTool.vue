<template>
  <div class="ce-kanban" :class="{'ce-kanban-fullscreen-active': fs}" :style="{height: content.height + 'px'}">
    <div class="ce-kanban-header flex justify-between items-center">
      <div class="kanban-header-left">
        <kanban-tool-title v-model="content.title"/>
      </div>
      <div class="kanban-header-right">
        <kanban-tool-fs v-model="fs"/>
      </div>
    </div>
    <div class="ce-kanban-container">
      <kanban-core v-model="content.groups" :read-only="readOnly"/>
    </div>
    <div v-if="!readOnly" class="ce-kanban-resize-handle" @mousedown="onMouseDown"></div>
  </div>
</template>
<script lang="ts" setup>
import {API} from '@editorjs/editorjs';
import {buildKanbanData, KanbanData, KanbanInstance} from "@/editor/SuperEditor/tools/KanbanTool/types";
import KanbanCore from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanCore.vue";
import KanbanToolFs from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanToolFs.vue";
import KanbanToolTitle from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanToolTitle.vue";

const content = defineModel({
  type: Object as PropType<KanbanData>,
  default: buildKanbanData
});

const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  api: {
    type: Object as PropType<API>,
    required: true
  }
});

let startY = 0;
let startHeight = 0;

const fs = ref(false);

provide(KanbanInstance, {
  data: content,
  move(oldGroupId: string, oldNodeId: string, newGroupId: string, newIndex: number): void {
    // 从原分组中删除节点
    for(const group of content.value.groups) {
      if(group.id === oldGroupId) {
        const index = group.nodes.findIndex(node => node.id === oldNodeId);
        if(index !== -1) {
          const old = group.nodes.splice(index, 1);
          // 在新分组的指定位置中加入节点
          if(newGroupId === group.id) {
            group.nodes.splice(newIndex, 0, old[0]);
          } else {
            for(const group of content.value.groups) {
              if(group.id === newGroupId) {
                group.nodes.splice(newIndex, 0, old[0]);
                break;
              }
            }
          }
        }
        return;
      }
    }
  },
  api: props.api
})

const onMouseDown = (e: MouseEvent) => {
  startY = e.clientY;
  startHeight = content.value.height;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  e.preventDefault();
};

const onMouseMove = (e: MouseEvent) => {
  const newHeight = startHeight + e.clientY - startY;
  // 限制高度在200px到800px之间
  content.value.height = Math.max(200, Math.min(800, newHeight));
};

const onMouseUp = () => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};
</script>
<style scoped lang="less">
.ce-kanban {
  min-height: 350px;
  position: relative;
  background-color: var(--td-bg-color-container);
  margin: 8px 0;
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-default);

  &.ce-kanban-fullscreen-active {
    position: fixed;
    top: 0;
    left: 50px;
    width: calc(100vw - 50px);
    height: 100vh;
    z-index: 100;
    margin: 0;
    border: none;
  }

  .ce-kanban-header {
    height: 40px;
    padding: 0 8px 0 16px;
    border-bottom: 1px solid var(--td-border-level-1-color);
  }

  .ce-kanban-container {
    height: calc(100% - 48px);
    margin-top: 4px;
    overflow: auto;
  }

  .ce-kanban-resize-handle {
    width: 100%;
    height: 6px;
    cursor: ns-resize;
    position: absolute;
    bottom: -3px;
    left: 0;
    background: transparent;
    transition: background-color 0.1s ease-in-out;
    text-align: center;
    line-height: 5px;
    z-index: 98;

    &:hover {
      background-color: var(--td-border-level-1-color) !important;
    }
  }
}
</style>
