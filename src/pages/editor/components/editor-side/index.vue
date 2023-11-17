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
            <a-tree :selected-keys="[selectKey]" :data="folder" :load-more="loadMore" :virtual-list-props="virtualListProps" @select="onSelect"/>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import EsWorkspace from "@/pages/editor/components/editor-side/es-workspace.vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {useWindowSize} from "@vueuse/core";

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
