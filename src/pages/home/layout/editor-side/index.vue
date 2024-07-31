<template>
    <div class="home-editor-side" ref="homeEditorSideRef">
        <header class="m-2">
            <a-input-group style="width: 100%">
                <a-input style="width: calc(100% - 32px);" v-model="keyword" allow-clear />
                <he-more />
            </a-input-group>
        </header>
        <a-tree :data="treeNodeData" :virtual-list-props="virtualListProps" :checkable="checkKeys.length > 0"
            :default-expand-all="false" :allow-drop="checkAllowDrop" block-node draggable @select="onSelect($event)"
            @drop="onDrop($event)" style="margin: 0 7px;" v-model:selected-keys="selectedKeys"
            v-model:checked-keys="checkKeys" v-model:expanded-keys="expandedKeys">
            <template #extra="nodeData">
                <a-dropdown trigger="click" :popup-max-height="false">
                    <a-button type="text">
                        <template #icon>
                            <icon-more />
                        </template>
                    </a-button>
                    <template #content>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-plus />
                            </template>
                            新增笔记
                            <template #content>
                                <a-doption v-for="articleType in articleTypes" :key="articleType.key"
                                    @click="addArticle(nodeData.key, articleType.key)">
                                    <template #icon>
                                        <component :is="articleType.icon" />
                                    </template>
                                    {{ articleType.name }}
                                </a-doption>
                            </template>
                        </a-dsubmenu>
                        <a-doption v-if="!nodeData.isLeaf" @click="addFolder(nodeData.key)">
                            <template #icon>
                                <icon-folder-add />
                            </template>
                            新建文件夹
                        </a-doption>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-apps />
                            </template>
                            更多操作
                            <template #content>
                                <a-doption @click="multiCheckStart(nodeData.key)">
                                    <template #icon>
                                        <icon-check-square />
                                    </template>
                                    多选
                                </a-doption>
                                <a-doption @click="rename(nodeData.key, nodeData.title, nodeData.isLeaf)">
                                    <template #icon>
                                        <icon-edit />
                                    </template>
                                    重命名
                                </a-doption>
                                <a-doption @click="remove(nodeData.key, nodeData.title, nodeData.isLeaf)"
                                    style="color: red;">
                                    <template #icon>
                                        <icon-delete />
                                    </template>
                                    删除
                                </a-doption>
                                <a-doption @click="moveTo(nodeData.key, nodeData.title, nodeData.isLeaf)">
                                    <template #icon>
                                        <icon-to-right />
                                    </template>
                                    移动到
                                </a-doption>
                            </template>
                        </a-dsubmenu>

                        <a-doption v-if="nodeData.isLeaf" @click="multiCheckStart(nodeData.key)">
                            <template #icon>
                                <icon-check-square />
                            </template>
                            多选
                        </a-doption>
                        <a-doption v-if="nodeData.isLeaf"
                            @click="rename(nodeData.key, nodeData.title, nodeData.isLeaf)">
                            <template #icon>
                                <icon-edit />
                            </template>
                            重命名
                        </a-doption>
                        <a-doption v-if="nodeData.isLeaf" @click="remove(nodeData.key, nodeData.title, nodeData.isLeaf)"
                            style="color: red;">
                            <template #icon>
                                <icon-delete />
                            </template>
                            删除
                        </a-doption>
                        <a-doption v-if="nodeData.isLeaf"
                            @click="moveTo(nodeData.key, nodeData.title, nodeData.isLeaf)">
                            <template #icon>
                                <icon-to-right />
                            </template>
                            移动到
                        </a-doption>

                        <a-doption v-if="!nodeData.isLeaf" @click="showArticleImportModal(nodeData.key)">
                            <template #icon>
                                <icon-import />
                            </template>
                            导入
                        </a-doption>
                        <a-doption v-if="!nodeData.isLeaf" @click="exportToMd(nodeData.key)">
                            <template #icon>
                                <icon-export />
                            </template>
                            导出为ZIP
                        </a-doption>
                    </template>
                </a-dropdown>
            </template>
        </a-tree>
        <div class="option" v-if="checkKeys.length > 0">
            <a-space class="btn">
                <a-popconfirm content="确认删除这些文章，注意：不会删除目录" @ok="multiCheckDelete()">
                    <a-button status="danger" type="text">
                        <template #icon>
                            <icon-delete />
                        </template>
                    </a-button>
                </a-popconfirm>
                <a-tooltip content="移动到">
                    <a-button type="text" @click="moveMultiTo()">
                        <template #icon>
                            <icon-to-right />
                        </template>
                    </a-button>
                </a-tooltip>
                <a-tooltip content="全选">
                    <a-button type="text" @click="selectAll()">
                        <template #icon>
                            <icon-select-all />
                        </template>
                    </a-button>
                </a-tooltip>
                <a-button type="text" @click="multiCheckStop()">
                    <template #icon>
                        <icon-close />
                    </template>
                </a-button>
            </a-space>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { TreeNodeData } from "@arco-design/web-vue";
import { useArticleStore } from "@/store/db/ArticleStore";
import { useFolderStore } from "@/store/db/FolderStore";
import { useElementSize } from "@vueuse/core";
import { useHomeEditorStore } from "@/store/components/HomeEditorStore";
import { useBaseSettingStore } from "@/store/setting/BaseSettingStore";
import { useGlobalStore } from "@/store/GlobalStore";
import {
    addArticle,
    addFolder, articleTypes,
    exportToMd,
    remove,
    rename
} from "@/pages/home/components/he-context";
import { keyword } from "@/global/BeanFactory";
import MessageUtil from "@/utils/modal/MessageUtil";
import Constant from "@/global/Constant";
import { openFolderChoose } from "@/components/ArticePreview/FolderChoose";
import { getItemByDefault, setItem } from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import { useNoteTree } from "@/hooks/NoteTree";
import { showArticleImportModal } from "@/pages/home/components/ArticleImportModal";
import HeMore from "@/pages/home/layout/editor-side/components/he-more.vue";

const homeEditorSideRef = ref();
const size = useElementSize(homeEditorSideRef);

const selectedKeys = ref<Array<number>>(useHomeEditorStore().id === 0 ? [] : [useHomeEditorStore().id]);
const checkKeys = ref<Array<number>>([]);
const expandedKeys = ref<Array<number>>(getItemByDefault<Array<number>>(LocalNameEnum.KEY_HOME_EXPANDED_KEYS, []));

const virtualListProps = computed(() => ({
    height: size.height.value - 56
}));
const { treeNodeData } = useNoteTree(keyword);

watch(() => useHomeEditorStore().id, id => {
    selectedKeys.value = [id];
    expandTo(id);
});


watch(() => expandedKeys.value, value => setItem(LocalNameEnum.KEY_HOME_EXPANDED_KEYS, value), { deep: true });

function onSelect(selectKeys: Array<number | string>) {
    const id = selectKeys[0] as number;
    if (useArticleStore().articleMap.has(id)) {
        useHomeEditorStore().openArticle(id);
        if (useBaseSettingStore().autoCollapsedByEditor && size.width.value < Constant.autoCollapsedWidth) {
            useHomeEditorStore().switchCollapsed();
        }
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


function multiCheckStart(id: number) {
    checkKeys.value.push(id);
}

function multiCheckStop() {
    checkKeys.value = [];
}

function multiCheckDelete() {
    useGlobalStore().startLoading("开始删除")
    useArticleStore().removeBatchByIds(checkKeys.value)
        .then(() => MessageUtil.success("删除成功"))
        .catch(e => MessageUtil.error("删除失败", e))
        .finally(() => {
            useGlobalStore().closeLoading();
            checkKeys.value = [];
        });
}

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
            } else {
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

expandTo(useHomeEditorStore().id);

function expandTo(id: number) {
    const article = useArticleStore().articleMap.get(id);
    if (article && article.folder !== 0) {
        _expandTo(article.folder);
    }
}

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

function selectAll() {
    checkKeys.value = useArticleStore().articles.map(e => e.id);
}

function moveTo(id: number, name: string, article: boolean) {
    let folderId: number | undefined = undefined;
    if (article) {
        // 文章，则需要找父文件夹
        const articleIndex = useArticleStore().articleMap.get(id);
        if (articleIndex) {
            folderId = articleIndex.folder;
        }
    } else {
        folderId = id;
    }
    openFolderChoose(folderId).then(folder => {
        if (article) {
            // 更新文章文件夹
            useArticleStore().updateIndex(id, { folder: folder.id })
                .then(() => MessageUtil.success("移动成功"))
        } else {
            useFolderStore().drop(id, folder.id);
        }
    })
}

function moveMultiTo() {
    openFolderChoose().then(folder => {
        useGlobalStore().startLoading("开始移动");
        try {
            const articleMap = useArticleStore().articleMap;
            // 文章
            const articleIds = checkKeys.value.filter(id => articleMap.has(id));
            if (articleIds.length > 0) {
                useArticleStore().updateMultiIndex(articleIds.map(id => ({
                    id,
                    folder: folder.id
                })))
            }
            const { folderMap } = useArticleStore();
            // 文件夹
            const folderIds = checkKeys.value.filter(id => folderMap.has(id));
            if (folderIds.length > 0) {
                useFolderStore().updateMulti(folderIds.map(id => ({
                    id,
                    pid: folder.id
                })))
            }
            checkKeys.value = [];
            MessageUtil.success("移动成功");
        } catch (e) {
            MessageUtil.error("移动失败");
        } finally {
            useGlobalStore().closeLoading();
        }
    })
}

</script>
<style lang="less">
.home-editor-side {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .option {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 14px;
        display: flex;
        justify-content: center;

        .btn {
            border: 1px solid var(--color-neutral-3);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.6);
        }

    }
}

body[arco-theme=dark] {
    .home-editor-side {

        .option {

            .btn {
                background-color: rgba(0, 0, 0, 0.6);
            }

        }
    }

}
</style>
