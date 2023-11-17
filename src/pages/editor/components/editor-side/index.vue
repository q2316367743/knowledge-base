<template>
    <div class="editor-side">
        <header class="header">
            <a-space>
                <es-workspace/>
                <a-tooltip content="刷新目录">
                    <a-button type="primary" :disabled="driverId === 0">
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
            <a-tree :data="folder"/>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import EsWorkspace from "@/pages/editor/components/editor-side/es-workspace.vue";
import {TreeNodeData} from "@arco-design/web-vue";

const folder = ref<Array<TreeNodeData>>([]);
useEditorDriverStore().folders().then(items => folder.value = items);

const driverId = computed(() => useEditorDriverStore().driverId);
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
