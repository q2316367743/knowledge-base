<template>
    <div class="editor-side">
        <header class="header">
            <a-space>
                <es-workspace/>
                <a-tooltip content="重置目录">
                    <a-button type="primary" :disabled="driverId === 0" @click="refresh()">
                        <template #icon>
                            <icon-refresh/>
                        </template>
                    </a-button>
                </a-tooltip>
                <es-setting/>
                <a-dropdown>
                    <a-button type="primary" :disabled="driverId === 0">
                        <template #icon>
                            <icon-plus/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="addFile()">新建文件</a-doption>
                        <a-doption @click="addFolder()">新建文件夹</a-doption>
                    </template>
                </a-dropdown>
            </a-space>
        </header>
        <main class="container">
            <div id="editor-tree" class="ztree"/>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import EsWorkspace from "@/pages/editor/components/editor-side/es-workspace.vue";
import {useWindowSize} from "@vueuse/core";
import EsSetting from "@/pages/editor/components/editor-side/es-setting.vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import MessageUtil from "@/utils/MessageUtil";
import {TreeNode, ZTreeInstance, ZTreeSetting} from "@/plugin/sdk/ZTree";

const size = useWindowSize();

let zTreeObj: null | ZTreeInstance = null;
const root = () => ({key: "", isLeaf: false, name: '', children: []});

const folder = ref<TreeNode | null>(null);

const driverId = computed(() => useEditorDriverStore().driverId);
const selectKey = computed(() => useEditorDriverStore().selectKey);

watch(() => useEditorDriverStore().driverId,
    value => {
        if (value === 0) {
            // TODO: 清空
        } else {
            // TODO: 重新获取
        }
    });


// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
const setting: ZTreeSetting = {
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: (treeId, treeNode) => {
            if (treeNode.isLeaf) {
                return true;
            }
            const children = useEditorDriverStore().itemsMap.get(treeNode.key);
            return typeof children !== 'undefined' && children.length === 0;
        },
        showRenameBtn: true,
        removeTitle: "删除",
        renameTitle: "重命名"
    },
    callback: {
        beforeExpand(treeId: string, treeNode: TreeNode): boolean {
            if (!useEditorDriverStore().itemsMap.has(treeNode.key)) {
                // 不存在
                if (!treeNode.isLeaf) {
                    // 文件夹
                    useEditorDriverStore().getNodes(treeNode.key)
                        .then(nodes => {
                            if (zTreeObj) {
                                zTreeObj.addNodes(treeNode, 0, nodes, false);
                            }
                        })
                }
            }
            return true;
        },
        beforeClick(treeId, treeNode, clickFlag) {
            if (clickFlag === 2) {
                MessageUtil.warning("不支持多选");
                return false;
            }
            return true;
        },
        onClick(e, treeId, treeNode, clickFlag) {
            folder.value = treeNode.isLeaf || clickFlag !== 1 ? null : treeNode;
            if (clickFlag === 1) {
                if (treeNode.isLeaf) {
                    useEditorDriverStore().setSelectKey(treeNode.key);
                } else {
                    useEditorDriverStore().setSelectKey("");
                }
            } else if (clickFlag === 0) {
                useEditorDriverStore().setSelectKey("");
            }
        },
        beforeRemove(treeId, treeNode) {
            const path = treeNode.key;
            const file = treeNode.isLeaf;
            const name = treeNode.name;
            MessageBoxUtil.confirm(`是否删除文件${file ? "" : "夹"}【${name}】？`, `删除文件${file ? "" : "夹"}`)
                .then(() => {
                    const rsp: Promise<void> = file ?
                        useEditorDriverStore().service.removeFile(path) :
                        useEditorDriverStore().service.removeDir(path);
                    rsp.then(() => {
                        MessageUtil.success("删除成功");
                        // 重新获取目录
                        if (path === useEditorDriverStore().selectKey) {
                            // 当前目录就是删除的
                            useEditorDriverStore().setSelectKey("");
                        }
                        // 删除节点
                        if (zTreeObj) {
                            zTreeObj.removeNode(treeNode, false);
                        }
                    }).catch(e => MessageUtil.error("删除失败", e))
                });
            return false;
        }
    }
};

onMounted(init);

function init() {
    // @ts-ignore
    zTreeObj = $.fn.zTree.init($("#editor-tree"), setting, null);
    useEditorDriverStore().folders().then(items => {
        if (zTreeObj) {
            zTreeObj.addNodes(null, 0, items, false);
        }
    })
}

function refresh() {
    if (folder.value) {
        // 刷新确定的目录
        renderFolder(folder.value);
    } else {
        // 刷新根目录
        renderFolder(root());
    }
}

/**
 * 刷新某个节点
 * @param node 节点
 */
function renderFolder(node: TreeNode) {
    if (node.key === '') {
        // 清空全部缓存
        useEditorDriverStore().itemsMap.clear();
        // 重新初始化
        init();
    } else {
        if (!zTreeObj) {
            MessageUtil.warning("系统异常，树未初始化");
            return;
        }
        // 先移除缓存
        useEditorDriverStore().itemsMap.delete(node.key);
        // 再删除子节点
        zTreeObj.removeChildNodes(node);
        // 在重新获取
        useEditorDriverStore().getNodes(node.key)
            .then(nodes => {
                if (!zTreeObj) {
                    MessageUtil.warning("系统异常，树未初始化");
                    return;
                }
                zTreeObj.addNodes(node, 0, nodes, false);
            })
    }
}


function addFile() {
    // 创建文件
    MessageBoxUtil.prompt("请输入文件名", "新建文件", {
        confirmButtonText: "新增"
    }).then(name => _addFile(name))
        .then(() => MessageUtil.success("新增成功"))
        .catch(e => MessageUtil.error("新增失败", e))
}

async function _addFile(name: string) {
    // 创建文件
    const path = folder.value ? folder.value.key : useEditorDriverStore().rootPath;
    await useEditorDriverStore().service.addFile(path, name);
    // 刷新目录
    renderFolder(folder.value || root());
}


function addFolder() {
    // 创建文件
    MessageBoxUtil.prompt("请输入文件夹名", "新建文件夹", {
        confirmButtonText: "新增"
    }).then(name => _addFolder(name))
        .then(() => MessageUtil.success("新增成功"))
        .catch(e => MessageUtil.error("新增失败", e))
}

async function _addFolder(name: string) {
    // 创建文件
    const path = folder.value ? folder.value.key : useEditorDriverStore().rootPath;
    await useEditorDriverStore().service.addFolder(path, name);
    // 刷新目录
    renderFolder(folder.value || root());
}

function rename(path: string, name: string, file: boolean) {
}

</script>
<style lang="less">
.editor-side {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    .header {
        padding: 7px;
    }

    .container {
        position: absolute;
        top: 46px;
        right: 7px;
        left: 7px;
        bottom: 7px;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

.ztree {
    color: var(--color-text-1);

    li a {
        width: calc(100% - 19px);
        padding-left: 0;
    }

    .node_name {
        color: var(--color-text-1);

    }
}
</style>
