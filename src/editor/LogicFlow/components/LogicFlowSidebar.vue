<template>
  <div class="logic-flow-sidebar">
    <t-popup v-for="group in diagramGroups" :key="group.key" placement="right" :show-arrow="true" :popup-offset="8">
      <div class="group-item">
        {{ group.name }}
      </div>
      <template #content>
        <div class="logic-flow-sidebar-group-content">
          <t-tooltip v-for="node in group.nodes" :key="node.name" :content="node.tip">
            <div class="node-item" @mousedown="dragInNode(node.name)">
              <component :is="node.icon"></component>
            </div>
          </t-tooltip>
        </div>
      </template>
    </t-popup>
  </div>
</template>
<script lang="ts">
import icons from '../icon';
import {DiagramGroup} from "../node/data/DiagramNode";
import {contains} from "@/utils/lang/ArrayUtil";
import {LogicFlow} from "@logicflow/core";

export default defineComponent({
  name: 'LogicFlowSidebar',
  emits: ['save'],
  props: {
    diagramGroups: {
      type: Object as PropType<Array<DiagramGroup>>,
      required: false,
      default: new Array<DiagramGroup>()
    },
    lf: Object as PropType<LogicFlow>,
  },
  methods: {
    contains,
    dragInNode(type: any) {
      if (!this.lf) {
        return;
      }
      this.lf.dnd.startDrag({
        type
      });
    }
  },
  components: icons,
})
</script>

<style scoped lang="less">
.logic-flow-sidebar {
  user-select: none;
  padding: 8px 4px;
  background-color: var(--td-bg-color-container);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border-2);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);


  .group-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-2);
    cursor: pointer;

    &:hover {
      background-color: var(--color-fill-2);
    }
  }
}

.logic-flow-sidebar-group-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border-radius: 4px;
  width: 200px;

  .node-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 4px;

    svg {
      left: 1px;
      top: 1px;
      width: 32px;
      height: 30px;
      display: block;
      position: relative;
      overflow: hidden;
    }

    &:hover {
      background-color: var(--td-bg-color-component-hover);
    }
  }
}

</style>
