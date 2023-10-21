<template>
    <a-modal v-model:visible="visible" ok-text="保存" class="todo-item-article" width="60vw"
             title-align="start" :mask-closable="false" :unmount-on-close="false" @ok="submit()">
        <template #title>
            <a-input-search v-model="keyword" allow-clear style="width: 40vw"
                            placeholder="请输入文章名称，点击新增进行文章关联。"/>
        </template>

        <a-tree v-model:checked-keys="selectKeys" :data="treeNodeData" :default-expand-all="false" block-node
                style="margin: 0 7px;">
        </a-tree>

    </a-modal>
</template>
<script lang="ts" setup>
import {computed, h, ref} from "vue";
import {useTodoAddArticleEvent} from "@/global/BeanFactory";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useTodoStore} from "@/store/components/TodoStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {TreeNodeData} from "@arco-design/web-vue";
import {searchData, treeEach} from "@/entity/ListTree";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {IconBook, IconCode, IconFile} from "@arco-design/web-vue/es/icon";

const visible = ref(false);
const keyword = ref('');
const selectKeys = ref(new Array<number>());

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
                icon: () => {
                    if (article.type === ArticleTypeEnum.CODE) {
                        return h(IconCode, {})
                    } else if (article.type === ArticleTypeEnum.RICH_TEXT) {
                        return h(IconBook, {})
                    } else {
                        return h(IconFile, {})
                    }
                },
                checkable: true
            })).forEach(article => treeData.push(article));
        }
    })
    return treeData;
});
const treeNodeData = computed(() => searchData(keyword.value, treeData.value));

useTodoAddArticleEvent.reset();
useTodoAddArticleEvent.on(() => {
    visible.value = true;
    keyword.value = '';
    selectKeys.value = useTodoStore().todoArticles;
});

function submit() {
    useTodoStore().associationArticle(selectKeys.value);
}

</script>
<style lang="less">
.todo-item-article {
    .arco-modal-body {
        height: 50vh;
    }
}
</style>
