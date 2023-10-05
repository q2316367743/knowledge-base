<template>
    <div class="home-editor-side">
        <header style="margin: 7px;">
            <a-input-group>
                <a-input style="width: 218px;"/>
                <a-button type="text" @click="addFolder(0)">
                    <template #icon>
                        <icon-plus/>
                    </template>
                </a-button>
            </a-input-group>
        </header>
        <a-tree :data="treeData" block-node :virtual-list-props="virtualListProps" @select="onSelect($event)">
            <template #extra="nodeData">
                <a-dropdown>
                    <a-button type="text">
                        <template #icon>
                            <icon-more />
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption v-if="!nodeData.isLeaf" @click="addFolder(nodeData.key)">
                            <template #icon>
                                <icon-plus />
                            </template>
                            新增
                        </a-doption>
                        <a-doption>
                            <template #icon>
                                <icon-edit />
                            </template>
                            修改
                        </a-doption>
                        <a-doption style="color: red;">
                            <template #icon>
                                <icon-delete />
                            </template>
                            删除
                        </a-doption>
                    </template>

                </a-dropdown>
            </template>
        </a-tree>
    </div>
</template>
<script lang="ts" setup>
import {computed, h} from "vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {treeEach} from "@/entity/ListTree";
import {IconFile} from "@arco-design/web-vue/es/icon";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useWindowSize} from "@vueuse/core";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";

const size = useWindowSize();

const folderTree = computed(() => useFolderStore().folderTree);
const categoryMap = computed(() => useArticleStore().categoryMap);
const treeData = computed<Array<TreeNodeData>>(() => {
    let treeData = new Array<TreeNodeData>();
    treeEach(folderTree.value, treeData, categoryMap.value);
    treeData = treeData.length === 0 ? [] : (treeData[0].children || []);
    // 没有分类
    const articles = categoryMap.value.get(null);
    if (articles && articles.length > 0) {
        articles.map(article => ({
            key: article.id,
            title: article.name,
            isLeaf: true,
            icon: () => h(IconFile, {}),
        })).forEach(article => treeData.push(article));
    }
    return treeData;
});
const virtualListProps = computed(() => ({
    height: size.height.value - 46
}));

function onSelect(selectKeys: Array<number>) {
    const id = selectKeys[0];
    if (useArticleStore().articleMap.has(id)) {
        useHomeEditorStore().setId(id);
    }
}

function addFolder(pid: number) {
    MessageBoxUtil.prompt("请输入文件夹名称", "新建文件夹", {
        confirmButtonText: "新增",
        cancelButtonText: "取消"
    }).then(name => {
        useFolderStore().addFolder(pid, name)
            .then(() => MessageUtil.success("新增成功"))
            .catch(e => MessageUtil.error("新增失败", e));
    })
}

</script>
<style lang="less">
.home-editor-side {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
