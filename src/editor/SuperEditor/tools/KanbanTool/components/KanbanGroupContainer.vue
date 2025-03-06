<template>
  <div class="kanban-group-container" ref="el">
    <kanban-node v-for="(node, i) in nodes" v-model="nodes[i]" :key="node.id" :readOnly="readOnly"
                 :data-group-id="groupId" :data-node-id="node.id"/>
  </div>
</template>
<script lang="ts" setup>
import {KanbanDataNode, KanbanInstance} from "@/editor/SuperEditor/tools/KanbanTool/types";
import KanbanNode from "@/editor/SuperEditor/tools/KanbanTool/components/KanbanNode.vue";
import {useSortable} from "@vueuse/integrations/useSortable";

const nodes = defineModel({
  type: Object as PropType<Array<KanbanDataNode>>,
  default: () => ([])
});
const props = defineProps({
  readOnly: {
    type: Boolean,
    default: false
  },
  groupId: String
});

const el = ref();

const instance = inject(KanbanInstance);

useSortable(el, nodes, {
  animation: 300,
  handle: '.kanban-node',
  group: 'kanban-node',
  onAdd(e) {
    const {item, newIndex} = e;
    if (item.attributes.getNamedItem("data-group-id")) {
      const groupId = item.attributes.getNamedItem("data-group-id")?.value;
      const nodeId = item.attributes.getNamedItem("data-node-id")?.value;
      // 进行移动
      instance?.move(groupId!, nodeId!, props.groupId!, newIndex!);
    }
  }
})
</script>
<style scoped lang="less">
.kanban-group-container {
  height: calc(100% - 40px);
  overflow: auto;
}
</style>
