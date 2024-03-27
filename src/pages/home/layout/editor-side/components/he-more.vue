<template>
    <a-dropdown>
        <a-button type="primary">
            <template #icon>
                <icon-plus/>
            </template>
        </a-button>
        <template #content>
            <a-doption @click="addFolder(0)">
                <template #icon>
                    <icon-folder-add/>
                </template>
                新建文件夹
            </a-doption>
            <a-dsubmenu>
                <template #icon>
                    <icon-plus/>
                </template>
                新增笔记
                <template #content>
                    <a-doption v-for="articleType in articleTypes" :key="articleType.key"
                               @click="addArticle(0, articleType.key)">{{ articleType.name }}
                    </a-doption>
                </template>
            </a-dsubmenu>
            <a-dsubmenu>
                <template #icon>
                    <icon-sort/>
                </template>
                排序
                <template #content>
                    <a-doption v-for="item in items" :style="renderSort(item.key)" :key="item.key"
                               @click="setSort(item.key)">
                        {{ item.name }}
                    </a-doption>
                </template>
            </a-dsubmenu>
            <a-doption @click="showArticleImportModal(0)">
                <template #icon>
                    <icon-import/>
                </template>
                导入
            </a-doption>
            <a-doption @click="exportToMd(0)">
                <template #icon>
                    <icon-export/>
                </template>
                导出为ZIP
            </a-doption>
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
import {
    addArticle, addArticleModal,
    addFolder, articleTypes,
    exportToMd, remove,
} from "@/pages/home/components/he-context";
import {computed, onBeforeUnmount, onMounted} from "vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import {showArticleImportModal} from "@/pages/home/components/ArticleImportModal";
import {useDeleteEvent, useNewEvent} from "@/global/BeanFactory";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";

const items = [{
    key: ArticleSortEnum.CREATE_TIME_ASC,
    name: '创建时间正序'
}, {
    key: ArticleSortEnum.CREATE_TiME_DESC,
    name: '创建时间倒序'
}, {
    key: ArticleSortEnum.NAME_ASC,
    name: '名字正序'
}, {
    key: ArticleSortEnum.NAME_DESC,
    name: '名字倒序'
}]

const articleSort = computed(() => useHomeEditorStore().articleSort);
const setSort = useHomeEditorStore().setSort;

function renderSort(sort: ArticleSortEnum) {
    if (articleSort.value === sort) {
        return {
            color: 'green'
        }
    } else {
        return {
            color: 'var(--color-text-1)'
        }
    }
}

function onNewArticle() {
    addArticleModal();
}

function onDeleteArticle() {
    const {id} = useHomeEditorStore();
    const {articleMap} = useArticleStore();
    const articleIndex = articleMap.get(id);
    if (articleIndex) {
        remove(articleIndex.id, articleIndex.name, true)
    } else {
        MessageUtil.warning("仅支持删除文章");
    }
}


onMounted(() => {
    useNewEvent.off(onNewArticle);
    useNewEvent.on(onNewArticle);
    useDeleteEvent.off(onDeleteArticle);
    useDeleteEvent.on(onDeleteArticle);
});

onBeforeUnmount(() => {
    useNewEvent.off(onNewArticle);
    useDeleteEvent.off(onDeleteArticle);
});

</script>
<style scoped>

</style>
