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
                新增文章
                <template #content>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.MARKDOWN)">markdown</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.RICH_TEXT)">富文本</a-doption>
                    <a-doption @click="addArticle(0, ArticleTypeEnum.CODE)">代码</a-doption>
                </template>
            </a-dsubmenu>
            <a-dsubmenu>
                <template #icon>
                    <icon-import/>
                </template>
                导入
                <template #content>
                    <a-doption @click="importArticleByMd()">markdown文件</a-doption>
                    <a-tooltip content="仅能保留部分格式，图片资源将以base64方式存储，最大导入文件支持1M">
                        <a-doption @click="importArticleByDocx()">docx文件</a-doption>
                    </a-tooltip>
                    <a-tooltip content="导入压缩包中全部markdown文件，文件路径为文件名">
                        <a-doption @click="importArticleByZip()">zip文件</a-doption>
                    </a-tooltip>
                </template>
            </a-dsubmenu>
            <a-dsubmenu>
                <template #icon>
                    <icon-export/>
                </template>
                导出
                <template #content>
                    <a-tooltip content="将全部笔记保存为ZIP，并保留目录结构">
                        <a-doption @click="exportToMd()">导出为ZIP</a-doption>
                    </a-tooltip>
                </template>
            </a-dsubmenu>
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import MessageUtil from "@/utils/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useFolderStore} from "@/store/db/FolderStore";
import {markdownToZip} from "@/components/export-component/markdownToZip";
import {docxToArticle} from "@/components/export-component/docxToArticle";
import {mdToArticle} from "@/components/export-component/mdToArticle";
import {zipToArticle} from "@/components/export-component/zipToArticle";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

function addArticle(pid: number, type: ArticleTypeEnum) {
    useGlobalStore().startLoading("正在新增文章")
    useArticleStore().add(getDefaultArticleIndex({
        name: type === ArticleTypeEnum.CODE ? ("新建代码" + new Date().getTime() + '.md') : ("新建文章" + new Date().getTime()),
        folder: pid,
        type,
    }), getDefaultArticleBase(), "")
        .then(id => {
            MessageUtil.success("新增成功");
            useHomeEditorStore().setId(id);
            // 树选择
        })
        .catch(e => MessageUtil.error("新增失败", e))
        .finally(() => useGlobalStore().closeLoading());
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


function importArticleByMd() {
    _importArticleByMd()
        .then(() => MessageUtil.success("导入成功"))
        .catch(e => {
            if (e.message !== 'The user aborted a request.') {
                MessageUtil.error("导入失败", e)
            }
        })
}

async function _importArticleByMd() {
    const article = await mdToArticle();
    const articleId = await useArticleStore().add(getDefaultArticleIndex({
        name: article.title,
    }), getDefaultArticleBase(), article.content);
    // 切换文章
    useHomeEditorStore().setId(articleId);
}

function exportToMd() {
    useGlobalStore().startLoading("正在准备数据")
    markdownToZip()
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}


function importArticleByDocx() {
    _importArticleByDocx()
        .then(() => MessageUtil.success("导入成功"))
        .catch(e => {
            if (e.message !== 'The user aborted a request.') {
                MessageUtil.error("导入失败", e)
            }
        })
}

async function _importArticleByDocx() {
    const article = await docxToArticle();
    const articleId = await useArticleStore().add(getDefaultArticleIndex({
        name: article.title,
    }), getDefaultArticleBase(), article.content);
    // 切换文章
    useHomeEditorStore().setId(articleId);
}


function importArticleByZip() {
    zipToArticle()
        .then(() => MessageUtil.success("导入成功"))
        .catch(e => {
            if (e.message !== 'The user aborted a request.') {
                MessageUtil.error("导入失败", e)
            }
        })
}

</script>
<style scoped>

</style>
