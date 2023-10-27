<template>
    <div class="home-editor-side">
        <header style="margin: 7px;">
            <a-input-group style="width: 100%">
                <a-input style="width: calc(100% - 32px);" v-model="keyword" allow-clear/>
                <he-more />
            </a-input-group>
        </header>
        <a-tree v-model:selected-keys="selectedKeys" :data="treeNodeData" :virtual-list-props="virtualListProps"
                :default-expand-all="false" :allow-drop="checkAllowDrop" block-node draggable
                @select="onSelect($event)" @drop="onDrop($event)" style="margin: 0 7px;">
            <template #extra="nodeData">
                <a-dropdown>
                    <a-button type="text">
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            新增笔记
                            <template #content>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.RICH_TEXT)">富文本</a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.MARKDOWN)">markdown</a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.CODE)">代码</a-doption>
                            </template>
                        </a-dsubmenu>

                        <a-doption v-if="!nodeData.isLeaf" @click="addFolder(nodeData.key)">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            新建文件夹
                        </a-doption>
                        <a-doption v-if="!nodeData.isLeaf" @click="renameFolder(nodeData.key, nodeData.title)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                            重命名
                        </a-doption>
                        <a-doption @click="remove(nodeData.key, nodeData.title, nodeData.isLeaf)" style="color: red;">
                            <template #icon>
                                <icon-delete/>
                            </template>
                            删除
                        </a-doption>
                    </template>
                </a-dropdown>
            </template>
            <template #title="nodeData">
                <a-dropdown trigger="contextMenu">
                    <span>{{nodeData.title}}</span>
                    <template #content>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            新增笔记
                            <template #content>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.RICH_TEXT)">富文本</a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.MARKDOWN)">markdown</a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.CODE)">代码</a-doption>
                            </template>
                        </a-dsubmenu>

                        <a-doption v-if="!nodeData.isLeaf" @click="addFolder(nodeData.key)">
                            <template #icon>
                                <icon-plus/>
                            </template>
                            新建文件夹
                        </a-doption>
                        <a-doption v-if="!nodeData.isLeaf" @click="renameFolder(nodeData.key, nodeData.title)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                            重命名
                        </a-doption>
                        <a-doption @click="remove(nodeData.key, nodeData.title, nodeData.isLeaf)" style="color: red;">
                            <template #icon>
                                <icon-delete/>
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
import {computed, h, ref, watch} from "vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {searchData, treeEach} from "@/entity/ListTree";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {useWindowSize} from "@vueuse/core";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import Constant from "@/global/Constant";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import HeMore from "@/pages/home/components/he-more.vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {getDefaultArticleBase} from "@/entity/article";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {IconBook, IconCode, IconFile} from "@arco-design/web-vue/es/icon";

const size = useWindowSize();

const keyword = ref('');
const selectedKeys = ref<Array<number>>(useHomeEditorStore().id === 0 ? [] : [useHomeEditorStore().id]);

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
                    }else if (article.type === ArticleTypeEnum.RICH_TEXT) {
                        return h(IconBook, {})
                    }else {
                        return h(IconFile, {})
                    }
                },
            })).forEach(article => treeData.push(article));
        }
    })
    return treeData;
});
const virtualListProps = computed(() => ({
    height: size.height.value - 46
}));
const treeNodeData = computed(() => searchData(keyword.value, treeData.value));

watch(() => useHomeEditorStore().id, id => selectedKeys.value = [id]);

function onSelect(selectKeys: Array<number | string>) {
    const id = selectKeys[0] as number;
    if (useArticleStore().articleMap.has(id)) {
        useHomeEditorStore().setId(id);
        if (useBaseSettingStore().authCollapsed && size.width.value < Constant.autoCollapsedWidth) {
            useHomeEditorStore().switchCollapsed();
        }
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

function addArticle(pid: number, type: ArticleTypeEnum) {
    useGlobalStore().startLoading("正在新增文章")
    useArticleStore().add({
        name: type === ArticleTypeEnum.CODE ? ("新建代码" + new Date().getTime() + '.md') : ("新建文章" + new Date().getTime()),
        folder: pid,
        preview: false,
        type
    }, getDefaultArticleBase(), "")
        .then(id => {
            MessageUtil.success("新增成功");
            useHomeEditorStore().setId(id);
        })
        .catch(e => MessageUtil.error("新增失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

function remove(id: number, name: string, article: boolean) {
    MessageBoxUtil.confirm(`确认删除${article ? '文章' : '文件夹'}【${name}】？`, "删除提示", {
        confirmButtonText: "删除"
    }).then(() => {
        _remove(id, article)
            .then(() => MessageUtil.success("删除成功"))
            .catch(e => MessageUtil.error("删除失败", e));
    })
}

async function _remove(id: number, article: boolean) {
    if (article) {
        await useArticleStore().removeById(id)
    } else {
        // 删除文件夹
        await useFolderStore().removeFolder(id)
    }
}

function renameFolder(id: number, name: string) {
    MessageBoxUtil.prompt("请输入新的文件夹名称", "重命名", {
        confirmButtonText: "确认",
        inputValue: name
    }).then(newName => {
        useFolderStore().renameFolder(id, newName)
            .then(() => MessageUtil.success("重命名成功"))
            .catch(e => MessageUtil.error("重命名失败", e));
    })
}

/**
 * 检测节点是否允许被释放
 * @param options 参数
 */
function checkAllowDrop(options: { dropNode: TreeNodeData; dropPosition: -1 | 0 | 1; }): boolean {
    return !options.dropNode.isLeaf
}

function onDrop(data: { dragNode: TreeNodeData, dropNode: TreeNodeData, dropPosition: number }) {
    if (typeof data.dragNode.key !== 'undefined' &&
        typeof data.dropNode.key !== 'undefined') {
        if (data.dropPosition === 0) {
            if (data.dragNode.isLeaf) {
                // 文章
                useArticleStore().drop(data.dragNode.key as number, data.dropNode.key as number)
                    .then(() => MessageUtil.success("移动成功"))
                    .catch(e => MessageUtil.error("移动失败", e));
            }else {
                useFolderStore().drop(data.dragNode.key as number, data.dropNode.key as number)
                    .then(() => MessageUtil.success("移动成功"))
                    .catch(e => MessageUtil.error("移动失败", e));
            }
        } else {
            // 上或者下
            const target = useFolderStore().folderMap.get(data.dropNode.key as number);
            if (!target) {
                return;
            }
            if (data.dragNode.isLeaf) {
                // 文章
                useArticleStore().drop(data.dragNode.key as number, target.pid)
                    .then(() => MessageUtil.success("移动成功"))
                    .catch(e => MessageUtil.error("移动失败", e));
            } else {
                useFolderStore().drop(data.dragNode.key as number, target.pid)
                    .then(() => MessageUtil.success("移动成功"))
                    .catch(e => MessageUtil.error("移动失败", e));
            }
        }
    }
}

</script>
<style lang="less">
.home-editor-side {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
</style>
