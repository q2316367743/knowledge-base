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
import {useElementSize} from "@vueuse/core";
import {keyword} from "@/global/BeanFactory";
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openArticle} from "@/components/ArticePreview/OpenArticle";
import {useNoteTree} from "@/hooks/NoteTree";

const expandedKeys = ref<Array<number>>([]);
const previewHome = ref<HTMLDivElement>();

const size = useElementSize(previewHome);

const virtualListProps = computed(() => ({
    height: size.height.value - 46
}));
const {treeNodeData} = useNoteTree(keyword);

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
