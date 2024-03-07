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
                    <a-doption @click="addArticle(0, ArticleTypeEnum.RICH_TEXT)">富文本</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.MARKDOWN)">markdown</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.CODE)">代码</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.EXCEL)">表格</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.MIND_MAP)">思维导图</a-doption>
                </template>
            </a-dsubmenu>
            <a-doption @click="showArticleImportModal(0)">
                <template #icon>
                    <icon-import/>
                </template>
                导入
            </a-doption>
            <a-dsubmenu>
                <template #icon>
                    <icon-export/>
                </template>
                导出
                <template #content>
                    <a-tooltip content="将全部笔记保存为ZIP，并保留目录结构">
                        <a-doption @click="exportToMd(0)">导出为ZIP</a-doption>
                    </a-tooltip>
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
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {
    addArticle,
    addFolder,
    exportToMd,
} from "@/pages/home/components/he-context";
import {computed} from "vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleSortEnum from "@/enumeration/ArticleSortEnum";
import {showArticleImportModal} from "@/pages/home/components/ArticleImportModal";

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
</script>
<style scoped>

</style>
