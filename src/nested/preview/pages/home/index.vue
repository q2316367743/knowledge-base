<template>
    <div class="preview-home" ref="previewHome">
        <header style="margin: 7px;">
            <a-row :gutter="8">
                <a-col flex="auto">
                    <a-input v-model="keyword" allow-clear>
                        <template #suffix>
                            <icon-search />
                        </template>
                    </a-input>
                </a-col>
                <a-col flex="32px">
                    <a-button type="primary" @click="onRefresh()">
                        <template #icon>
                            <icon-refresh/>
                        </template>
                    </a-button>
                </a-col>
            </a-row>
        </header>
        <a-tree :data="treeNodeData" :virtual-list-props="virtualListProps"
                :default-expand-all="false" block-node draggable
                @select="onSelect($event)" style="margin: 0 7px;"
                v-model:expanded-keys="expandedKeys">
        </a-tree>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useElementSize} from "@vueuse/core";
import {TreeNodeData} from "@arco-design/web-vue";
import {keyword} from "@/global/BeanFactory";
import {searchData, treeEach, treeSort} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {buildArticleIcon} from "@/pages/home/components/he-context";
import {openArticle} from "@/components/ArticePreview/OpenArticle";

const expandedKeys = ref<Array<number>>([]);
const previewHome = ref<HTMLDivElement>();

const size = useElementSize(previewHome);
const router = useRouter();

const folderTree = computed(() => useFolderStore().folderTree);
const folderMap = computed(() => useArticleStore().folderMap);
const treeData = computed<Array<TreeNodeData>>(() => {
    let treeData = new Array<TreeNodeData>();
    treeEach(folderTree.value, treeData, folderMap.value);
    treeData = treeData.length === 0 ? [] : (treeData[0].children || []);
    // 文件夹被删除或没有的
    const articleFolders = new Set(Array.from(folderMap.value.keys()));
    useFolderStore().folderIds.forEach(folderId => articleFolders.delete(folderId));
    articleFolders.delete(0);
    articleFolders.forEach(folderId => {
        const articles = folderMap.value.get(folderId);
        if (articles && articles.length > 0) {
            articles.map(article => ({
                key: article.id,
                title: article.name,
                isLeaf: true,
                icon: () => buildArticleIcon(article.type, article.preview),
            })).forEach(article => treeData.push(article));
        }
    });
    // 树排序
    treeSort(treeData, useHomeEditorStore().articleSort);
    return treeData;
});
const virtualListProps = computed(() => ({
    height: size.height.value - 46
}));
const treeNodeData = computed(() => searchData(keyword.value, treeData.value));

function _expandTo(id: number) {
    if (id === 0) {
        return;
    }
    const parent = useFolderStore().folderMap.get(id);
    if (parent) {
        _expandTo(parent.pid);
    }
    if (expandedKeys.value.indexOf(id) === -1) {
        expandedKeys.value.push(id);
    }
}

function onSelect(selectKeys: Array<number | string>) {
    const id = selectKeys[0] as number;
    if (useArticleStore().articleMap.has(id)) {
        // router.push('/info/' + id);
        openArticle(id);
    } else {
        const index = expandedKeys.value.indexOf(id);
        if (index === -1) {
            // 不存在，展开
            _expandTo(id);
        } else {
            // 存在，收起
            expandedKeys.value.splice(index, 1);
        }
    }

}

function onRefresh() {
    useArticleStore().init(true);
    useFolderStore().init();
}
</script>
<style scoped>
.preview-home {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
