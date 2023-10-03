<template>
    <div class="graph-category">
        <a-tree :data="treeData" block-node :virtual-list-props="virtualListProps" @select="onSelect"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, h} from "vue";
import {CategoryTree, useCategoryStore} from "@/store/db/CategoryStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {TreeNodeData} from "@arco-design/web-vue";
import {IconFile, IconFolder} from "@arco-design/web-vue/es/icon";
import {useWindowSize} from "@vueuse/core";
import MessageUtil from "@/utils/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();
const size = useWindowSize();

const categoryTree = computed(() => useCategoryStore().categoryTree);
const categoryMap = computed(() => useArticleStore().categoryMap);
const treeData = computed<Array<TreeNodeData>>(() => {
    const treeData = new Array<TreeNodeData>();
    _categoryEach(categoryTree.value, treeData);
    // 没有分类
    const articles = categoryMap.value.get(null);
    if (articles && articles.length > 0) {
        treeData.push({
            key: -1,
            title: '未分类文章',
            isLeaf: false,
            icon: () => h(IconFolder, {}),
            children: articles.map(article => ({
                key: article.id,
                title: article.name,
                isLeaf: true,
                icon: () => h(IconFile, {}),
            }))
        })
    }
    return treeData;
});
const virtualListProps = computed(() => ({
    height: size.height.value - 14
}));

function _categoryEach(list: Array<CategoryTree>, treeData: Array<TreeNodeData>) {
    list.forEach(item => {
        const data = {
            key: item.key,
            title: item.title,
            isLeaf: false,
            icon: () => h(IconFolder, {}),
            children: new Array<TreeNodeData>()
        };
        treeData.push(data);
        // 分类
        _categoryEach(item.children, data.children);
        // 文章
        const articles = categoryMap.value.get(data.key);
        if (articles) {
            articles.map(article => ({
                key: article.id,
                title: article.name,
                isLeaf: true,
                icon: () => h(IconFile, {}),
            })).forEach(article => data.children.push(article));
        }
    });
}

function onSelect(
    selectedKeys: Array<string | number>,
    data: { selected?: boolean; selectedNodes: TreeNodeData[]; node?: TreeNodeData; e?: Event; }) {
    if (data.node) {
        onNodeClick(data.node);
    }
}


function onNodeClick(nodeObject: TreeNodeData) {
    if (nodeObject.isLeaf) {
        router.push({
            path: '/article/' + nodeObject.key,
            query: {
                redirect: '/graph/category'
            }
        });
    } else {
        if (nodeObject.title === '未分类文章') {
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