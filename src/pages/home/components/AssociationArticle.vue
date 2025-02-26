<template>
  <t-dialog v-model:visible="visible" placement="center" confirm-btn="选择" @confirm="onConfirm">
    <template #header>
      <a-space>
        <icon-book/>
        <div>参考笔记</div>
      </a-space>
    </template>
    <t-input v-model="keyword" @change="inputChange" placeholder="请输入文章标题进行搜索"/>
    <t-tree v-model="checkedKeys" :data="treeData" :expand-all="false" :checkable="true" max-height="70vh"
            :allow-fold-node-on-filter="true" :keys="keys" style="margin-top: 8px" :filter="filterFunc"/>
  </t-dialog>
</template>
<script lang="ts" setup>
import {InputProps, TreeNodeModel, TreeProps} from "tdesign-vue-next";
import {useNoteTree} from "@/hooks/NoteTree";

const visible = defineModel({
  type: Boolean,
  default: false
});

const props = defineProps({
  articleIds: {
    type: Object as PropType<Array<number>>,
    default: () => []
  }
});
const emit = defineEmits(['confirm']);

const keys = {label: 'title', value: 'key'};

const keyword = ref('');
const checkedKeys = ref<Array<number>>([]);
const filterFunc = ref<TreeProps['filter']>();

watch(visible, val => val && (checkedKeys.value = props.articleIds))

const {treeData} = useNoteTree();
const inputChange: InputProps['onChange'] = () => {
  if (keyword.value) {
    filterFunc.value = (node: TreeNodeModel) => node.data.title?.indexOf(keyword.value) >= 0
  } else {
    filterFunc.value = undefined;
  }
};

function onConfirm() {
  emit('confirm', checkedKeys.value);
  visible.value = false;
}

</script>
<style scoped lang="less">

</style>
