<template>
  <div class="mind-map-context" v-show="show">
    <div class="item" v-if="hasNode && hasLink" @click="openLink()">打开链接</div>
    <div class="item" v-if="hasNode && !isRoot && !isGeneralization" @click="insertNode()">插入同级节点</div>
    <div class="item" v-if="hasNode && !isGeneralization" @click="insertChildNode()">插入子级节点</div>
    <div class="item" v-if="hasNode && !isRoot && !isGeneralization" @click="insertParentNode()">插入父节点</div>
    <div class="item delete" v-if="hasNode" @click="deleteNode()">删除节点</div>
    <div class="item" v-if="hasNode && !isRoot && !isGeneralization" @click="insertGeneralization()">插入概要</div>
    <div class="item" v-if="hasNode && !isRoot && !isGeneralization" @click="insertAssociativeLine()">插入关联线
    </div>
    <div class="item" v-if="hasNode" @click="copy()">复制</div>
    <div class="item" v-if="hasNode" @click="cut()">剪切</div>
    <div class="item" v-if="hasNode" @click="paste()">黏贴</div>
    <div class="item" v-if="!hasNode" @click="expandAll()">展开所有</div>
    <div class="item" v-if="!hasNode" @click="unExpandAll()">收起所有</div>
    <div class="item" v-if="!hasNode" @click="resetLayout()">一键整理布局</div>

  </div>
</template>
<script lang="ts" setup>
import MindMap from "simple-mind-map";
import {MindMapNode, MindMapNodeData} from "@/editor/MindMapEditor/domain";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const props = defineProps({
  mindMap: Object as PropType<MindMap>
});
// 当前右键点击的类型
const type = ref<'' | 'node' | 'svg'>('')
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef<MindMapNode | null>(null)
// 菜单显示的位置
const left = ref('0px')
const top = ref('0px')
// 是否显示菜单
const show = ref(false);

const hasNode = computed(() => {
  if (type.value !== 'node') {
    return false;
  }
  if (!currentNode.value) {
    return false;
  }
  return !!currentNode.value;
});
const hasLink = computed(() => {
  if (!hasNode.value || !currentNode.value) {
    return false;
  }
  const nodeData = currentNode.value.nodeData.data as MindMapNodeData
  return !!nodeData.hyperlink;
});
const isRoot = computed(() => {
  if (!hasNode.value || !currentNode.value) {
    return false;
  }
  return currentNode.value.isRoot;
});
const isGeneralization = computed(() => {
  if (!hasNode.value || !currentNode.value) {
    return false;
  }
  return currentNode.value.isGeneralization;
});

const hide = () => {
  show.value = false
  left.value = '0px';
  top.value = '0px';
  type.value = '';
  currentNode.value = null;
}

onMounted(() => {
  if (!props.mindMap) {
    return;
  }
  props.mindMap.on('node_contextmenu', (e: PointerEvent, node: MindMapNode) => {
    type.value = 'node'
    left.value = e.offsetX + 10 + 'px'
    top.value = e.offsetY + 10 + 'px'
    show.value = true
    currentNode.value = node
  });
  props.mindMap.on('contextmenu', (e: PointerEvent) => {
    type.value = 'svg'
    left.value = e.offsetX + 10 + 'px'
    top.value = e.offsetY + 10 + 'px'
    show.value = true;
    currentNode.value = null;
  })

  props.mindMap.on('node_click', hide)
  props.mindMap.on('draw_click', hide)
  props.mindMap.on('expand_btn_click', hide)
});


function openLink() {
  if (type.value !== 'node') {
    return;
  }
  if (!currentNode.value) {
    return;
  }
  const nodeData = currentNode.value.nodeData.data as MindMapNodeData;
  const hyperlink = nodeData.hyperlink;
  if (!hyperlink) {
    return;
  }
  InjectionUtil.shellOpenExternal(hyperlink);
  hide();
}


// 插入兄弟节点
const insertNode = () => {
  if (hasNode.value && !isRoot.value && !isGeneralization.value) {
    props.mindMap && props.mindMap.execCommand('INSERT_NODE');
    hide();
  }
}

// 插入子节点
const insertChildNode = () => {
  if (hasNode.value && !isGeneralization.value) {
    props.mindMap && props.mindMap.execCommand('INSERT_CHILD_NODE');
    hide();
  }
}

// 插入兄弟节点
const insertParentNode = () => {
  if (hasNode.value && !isRoot.value && !isGeneralization.value) {
    props.mindMap && props.mindMap.execCommand('INSERT_PARENT_NODE');
    hide();
  }
}

// 删除节点
const deleteNode = () => {
  if (hasNode.value) {
    props.mindMap && props.mindMap.execCommand('REMOVE_NODE');
    hide();
  }
}
// 插入概要
const insertGeneralization = () => {
  if (hasNode.value && !isRoot.value && props.mindMap && !isGeneralization.value) {
    props.mindMap.execCommand('ADD_GENERALIZATION');
    hide();
  }
}
// 插入关联线
const insertAssociativeLine = () => {
  if (hasNode.value && !isRoot.value && props.mindMap && !isGeneralization.value) {
    // @ts-ignore
    props.mindMap.associativeLine.createLineFromActiveNode();
    hide();
  }
}

function copy() {
  if (hasNode.value && props.mindMap) {
    props.mindMap.renderer.copy();
    hide();
  }
}

function cut() {
  if (hasNode.value && props.mindMap) {
    props.mindMap.renderer.cut();
    hide();
  }
}

function paste() {
  if (hasNode.value && props.mindMap) {
    props.mindMap.renderer.paste();
    hide();
  }
}

// 重置布局
const resetLayout = () => {
  props.mindMap && props.mindMap.execCommand('RESET_LAYOUT');
  hide();
}

// 展开所有
const expandAll = () => {
  props.mindMap && props.mindMap.execCommand('EXPAND_ALL');
  hide();
}

// 收起所有
const unExpandAll = () => {
  props.mindMap && props.mindMap.execCommand('UNEXPAND_ALL');
  hide();
}
</script>
<style scoped lang="less">
.mind-map-context {
  position: absolute;
  left: v-bind(left);
  top: v-bind(top);
  background-color: var(--td-bg-color-component);
  color: var(--td-text-color-primary);
  border: 1px solid var(--td-border-level-2-color);
  border-radius: var(--td-radius-default);
  box-shadow: var(--td-shadow-3);
  width: 160px;
  font-size: .8rem;

  .item {
    padding: 7px 10px;
    border-bottom: 1px solid var(--td-border-level-2-color);
    cursor: pointer;

    &:hover {
      background-color: var(--td-brand-color-hover);
    }

    &.delete {
      color: rgb(var(--td-error-color));
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
