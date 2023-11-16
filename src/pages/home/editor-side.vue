<template>
    <div class="home-editor-side">
        <header style="margin: 7px;">
            <a-input-group style="width: 100%">
                <a-input style="width: calc(100% - 32px);" v-model="keyword" allow-clear/>
                <he-more/>
            </a-input-group>
        </header>
        <a-tree v-model:selected-keys="selectedKeys" :data="treeNodeData" :virtual-list-props="virtualListProps"
                :default-expand-all="false" :allow-drop="checkAllowDrop" block-node draggable
                :checkable="checkKeys.length > 0"
                @select="onSelect($event)" @drop="onDrop($event)" style="margin: 0 7px;"
                v-model:checked-keys="checkKeys">
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
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.RICH_TEXT)">富文本
                                </a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.MARKDOWN)">markdown
                                </a-doption>
                                <a-doption @click="addArticle(nodeData.key, ArticleTypeEnum.CODE)">代码</a-doption>
                            </template>
                        </a-dsubmenu>

                        <a-doption v-if="!nodeData.isLeaf" @click="addFolder(nodeData.key)">
                            <template #icon>
                                <icon-folder-add/>
                            </template>
                            新建文件夹
                        </a-doption>
                        <a-doption @click="rename(nodeData.key, nodeData.title, nodeData.isLeaf)">
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
                        <a-doption @click="multiCheckStart(nodeData.key)">
                            <template #icon>
                                <icon-edit/>
                            </template>
                            多选
                        </a-doption>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-import/>
                            </template>
                            导入
                            <template #content>
                                <a-dsubmenu>
                                    富文本
                                    <template #content>
                                        <a-tooltip content="仅能保留部分格式，图片资源将以base64方式存储，最大导入文件支持1M">
                                            <a-doption @click="importArticleByDocx(nodeData.key, ArticleTypeEnum.RICH_TEXT)">docx文件</a-doption>
                                        </a-tooltip>
                                        <a-doption @click="importTextToArticle(nodeData.key, ArticleTypeEnum.RICH_TEXT)">html文件</a-doption>
                                    </template>
                                </a-dsubmenu>
                                <a-dsubmenu>
                                    Markdown
                                    <template #content>
                                        <a-tooltip content="仅能保留部分格式，图片资源将以base64方式存储，最大导入文件支持1M">
                                            <a-doption @click="importArticleByDocx(nodeData.key, ArticleTypeEnum.MARKDOWN)">docx文件</a-doption>
                                        </a-tooltip>
                                        <a-doption @click="importHtmlToMarkdown(nodeData.key)">html文件</a-doption>
                                        <a-doption @click="importTextToArticle(nodeData.key, ArticleTypeEnum.MARKDOWN)">markdown文件</a-doption>
                                    </template>
                                </a-dsubmenu>
                                <a-doption @click="importTextToArticle(nodeData.key, ArticleTypeEnum.CODE)">代码文件</a-doption>
                                <a-tooltip content="导入压缩包中全部markdown文件，文件路径为文件名">
                                    <a-doption @click="importArticleByZip(nodeData.key)">zip文件</a-doption>
                                </a-tooltip>
                            </template>
                        </a-dsubmenu>
                        <a-dsubmenu v-if="!nodeData.isLeaf">
                            <template #icon>
                                <icon-export/>
                            </template>
                            导出
                            <template #content>
                                <a-tooltip content="将全部笔记保存为ZIP，并保留目录结构">
                                    <a-doption @click="exportToMd(nodeData.key)">导出为ZIP</a-doption>
                                </a-tooltip>
                            </template>
                        </a-dsubmenu>
                    </template>
                </a-dropdown>
            </template>
        </a-tree>
        <div class="option" v-if="checkKeys.length > 0">
            <a-space class="btn">
                <a-popconfirm content="确认删除这些文章，注意：不会删除目录" @ok="multiCheckDelete()">
                    <a-button status="danger" type="text">
                        <template #icon>
                            <icon-delete/>
                        </template>
                    </a-button>
                </a-popconfirm>
                <a-button type="text" @click="multiCheckStop()">
                    <template #icon>
                        <icon-close/>
                    </template>
                </a-button>
            </a-space>
        </div>
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
import MessageUtil from "@/utils/MessageUtil";
import Constant from "@/global/Constant";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import HeMore from "@/pages/home/components/he-more.vue";
import {useGlobalStore} from "@/store/GlobalStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {IconBook, IconCode, IconFile} from "@arco-design/web-vue/es/icon";
import {
    addArticle,
    addFolder,
    exportToMd,
    importArticleByDocx, importArticleByZip, importHtmlToMarkdown, importTextToArticle,
    remove,
    rename
} from "@/pages/home/components/he-context";

const size = useWindowSize();

const keyword = ref('');
const selectedKeys = ref<Array<number>>(useHomeEditorStore().id === 0 ? [] : [useHomeEditorStore().id]);
const checkKeys = ref<Array<number>>([]);

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
        if (useBaseSettingStore().autoCollapsedByEditor && size.width.value < Constant.autoCollapsedWidth) {
            useHomeEditorStore().switchCollapsed();
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
