<template>
  <t-dialog placement="center" v-model:visible="visible" width="700px">
    <template #header>
      <a-space>
        <icon-book/>
        <div>笔记解读</div>
      </a-space>
    </template>
    <t-input v-model="keyword" @change="inputChange" placeholder="请输入笔记标题进行搜索"/>
    <t-tree v-model="checkedKeys" :data="treeData" :expand-all="false" :checkable="true" max-height="70vh"
            :allow-fold-node-on-filter="true" :keys="keys" style="margin-top: 8px" :filter="filterFunc"/>
    <template #footer>
      <a-space direction="vertical">
        <a-space class="w-full" align="start" v-if="checkedKeys.length > 0">
          <t-button size="small" theme="primary" variant="outline" @click="summary">总结内容</t-button>
        </a-space>
        <ai-input placeholder="询问关于该笔记的任何问题"/>
      </a-space>
    </template>
  </t-dialog>
</template>
<script lang="ts" setup>
import {TreeProps, InputProps, TreeNodeModel} from 'tdesign-vue-next';
import {useNoteTree} from "@/hooks/NoteTree";
import {useChatStore} from "@/store/components/ChatStore";
import AiInput from "@/pages/home/components/AiInput.vue";
import MessageUtil from "@/utils/modal/MessageUtil";

const visible = defineModel({
  type: Boolean,
  default: false
});

const keys = {label: 'title', value: 'key'};

const keyword = ref('');
const checkedKeys = ref<Array<number>>(useChatStore().articleIds);
const filterFunc = ref<TreeProps['filter']>();

watch(checkedKeys, val => useChatStore().changeArticleIds(val));

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
  .ask("总结内容")
  .catch((e) => {
    MessageUtil.error("提问失败", e);
  });
</script>
<style scoped lang="less">

</style>
