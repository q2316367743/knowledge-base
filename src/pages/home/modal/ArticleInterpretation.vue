<template>
  <t-dialog placement="center" v-model:visible="visible" width="700px">
    <template #header>
      <t-space size="small">
        <file-word-icon/>
        <div>笔记解读</div>
      </t-space>
    </template>
    <t-input v-model="keyword" @change="inputChange" placeholder="请输入笔记标题进行搜索"/>
    <t-tree v-model="checkedKeys" :data="treeData" :expand-all="false" :checkable="true" max-height="50vh"
            :allow-fold-node-on-filter="true" style="margin-top: 8px" :filter="filterFunc">
      <template #label="{node}">
        <div class="flex justify-between w-full">
          <div class="flex items-center">
            <div :class="{'pt-6px': node.data.preview}">
              <component :is="node.data.icon"/>
            </div>
            <span class="mtl-ml p-3px">{{ node.data.label }}</span>
          </div>
        </div>
      </template>
    </t-tree>
    <template #footer>
      <div>
        <div class="w-full mb-8px flex flex-justify-items-start" v-if="checkedKeys.length > 0">
          <t-button class="mr-8px" size="small" theme="primary" variant="outline" @click="summary">总结内容</t-button>
        </div>
        <ai-input placeholder="询问关于该笔记的任何问题" :checked-keys="checkedKeys"/>
      </div>
    </template>
  </t-dialog>
</template>
<script lang="ts" setup>
import {TreeProps, InputProps, TreeNodeModel} from 'tdesign-vue-next';
import {useNoteTree} from "@/hooks/NoteTree";
import {useChatStore} from "@/store/components/ChatStore";
import AiInput from "@/pages/home/components/AiInput.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {FileWordIcon} from "tdesign-icons-vue-next";

const visible = defineModel({
  type: Boolean,
  default: false
});


const keyword = ref('');
const checkedKeys = ref<Array<number>>([]);
const filterFunc = ref<TreeProps['filter']>();


const {treeData} = useNoteTree();
const inputChange: InputProps['onChange'] = () => {
  if (keyword.value) {
    filterFunc.value = (node: TreeNodeModel) => node.data.title?.indexOf(keyword.value) >= 0
  } else {
    filterFunc.value = undefined;
  }
};

// 总结内容
const summary = () => useChatStore()
  .ask("总结内容", checkedKeys.value)
  .then(() => checkedKeys.value = [])
  .catch((e) => MessageUtil.error("提问失败", e));

</script>
<style scoped lang="less">

</style>
