<template>
    <div class="editor-side">
        <header class="header">
            <a-space>
                <es-workspace/>
                <a-tooltip content="刷新目录">
                    <a-button type="primary" :disabled="driverId === 0" @click="renderFolder()">
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
                        <a-doption>新增文章</a-doption>
                        <a-doption>新建文件夹</a-doption>
                    </template>
                </a-dropdown>
            </a-space>
        </header>
        <main class="container">
            <a-tree :selected-keys="[selectKey]" :data="folder" :load-more="loadMore" block-node
                    :virtual-list-props="virtualListProps" @select="onSelect">
                <template #extra="nodeData">
                    <a-dropdown>
                        <a-button type="text">
                            <template #icon>
                                <icon-more/>
                            </template>
                        </a-button>
                        <template #content>
                            <a-doption v-if="!nodeData.isLeaf">
                                <template #icon>
                                    <icon-file/>
                                </template>
                                新增文件
                            </a-doption>

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
                            <a-doption @click="remove(nodeData.key, nodeData.title, nodeData.isLeaf)"
                                       style="color: red;">
                                <template #icon>
                                    <icon-delete/>
                                </template>
                                删除
                            </a-doption>
                        </template>
                    </a-dropdown>
                </template>
            </a-tree>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import EsWorkspace from "@/pages/editor/components/editor-side/es-workspace.vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {useWindowSize} from "@vueuse/core";
import EsSetting from "@/pages/editor/components/editor-side/es-setting.vue";

const size = useWindowSize();

const virtualListProps = computed(() => ({
    height: size.height.value - 46 - 7
}));

const folder = ref<Array<TreeNodeData>>([]);

renderFolder();

const driverId = computed(() => useEditorDriverStore().driverId);
const selectKey = computed(() => useEditorDriverStore().selectKey);

watch(() => useEditorDriverStore().driverId,
        value => value === 0 ? folder.value = [] : useEditorDriverStore().folders().then(items => folder.value = items));

async function loadMore(nodeData: TreeNodeData) {
    nodeData.children = await useEditorDriverStore().getNodes(nodeData.key as string);
}

function renderFolder() {
    useEditorDriverStore().folders().then(items => folder.value = items);
}

function onSelect(keys: Array<any>, data: any) {
    const nodes = data['selectedNodes'] as TreeNodeData[];
    if (!nodes || nodes.length === 0) {
        useEditorDriverStore().setSelectKey("");
        return;
    }
    const node = nodes[0];
    if (node.isLeaf) {
        useEditorDriverStore().setSelectKey(keys[0]);
    } else {
        useEditorDriverStore().setSelectKey("");
    }
}

function addFile(folder: string) {}

function addFolder(folder: string) {}

function rename(path: string, name: string, file: boolean) {}

function remove(path: string, name: string, file: boolean) {}

</script>
<style scoped lang="less">
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
</style>
