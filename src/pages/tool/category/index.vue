<template>
  <div class="graph-category">
    <t-tree :data="treeData" :line="true" :scroll="{type: 'virtual'}" :style="{height: virtualHeight}"
            @click="onSelect"/>
  </div>
</template>
<script lang="ts" setup>
import {TreeNodeModel, TreeOptionData} from 'tdesign-vue-next';
import {FileIcon, FolderIcon} from "tdesign-icons-vue-next";
import {useArticleStore, useCategoryStore} from "@/store";
import {useWindowSize} from "@vueuse/core";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";
import {treeEach} from "@/entity/ListTree";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

const router = useRouter();
const size = useWindowSize();

const categoryTree = computed(() => useCategoryStore().categoryTree);
const categoryMap = computed(() => useArticleStore().categoryMap);
const treeData = computed<Array<TreeOptionData>>(() => {
  const treeData = new Array<TreeOptionData>();
  treeEach(categoryTree.value, treeData, categoryMap.value);
  // 没有分类
  const articles = categoryMap.value.get(null);
  if (articles && articles.length > 0) {
    treeData.push({
      value: -1,
      label: '未分类笔记',
      isLeaf: false,
      icon: () => h(FolderIcon, {}),
      children: articles.map(article => ({
        key: article.id,
        title: article.name,
        isLeaf: true,
        icon: () => h(FileIcon, {}),
      }))
    })
  }
  return treeData;
});
const virtualHeight = computed(() => (size.height.value - 14) + 'px');

function onSelect(context: { node: TreeNodeModel; e: MouseEvent; }) {
  onNodeClick(context.node.data);
}


function onNodeClick(nodeObject: TreeOptionData) {
  if (nodeObject.isLeaf) {
    useHomeEditorStore().openArticle(nodeObject.key as number)
    router.push('/home');
  } else {
    if (nodeObject.title === '未分类笔记') {
      MessageUtil.warning("无法搜索未分类")
      return false;
    }
    router.push({
      path: '/home',
      query: {
        category: nodeObject.key
      }
    });
  }
}

</script>
<style lang="less">
.graph-category {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 7px;
  overflow: auto;
}
</style>
