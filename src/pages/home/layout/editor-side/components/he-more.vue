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
                </template>
            </a-dsubmenu>
            <a-dsubmenu>
                <template #icon>
                    <icon-import/>
                </template>
                导入
                <template #content>
                    <a-dsubmenu>
                        富文本
                        <template #content>
                            <a-tooltip content="仅能保留部分格式，图片资源将以base64方式存储，最大导入文件支持1M">
                                <a-doption @click="importArticleByDocx(0, ArticleTypeEnum.RICH_TEXT)">docx文件</a-doption>
                            </a-tooltip>
                            <a-doption @click="importTextToArticle(0, ArticleTypeEnum.RICH_TEXT)">html文件</a-doption>
                        </template>
                    </a-dsubmenu>
                    <a-dsubmenu>
                        Markdown
                        <template #content>
                            <a-tooltip content="仅能保留部分格式，图片资源将以base64方式存储，最大导入文件支持1M">
                                <a-doption @click="importArticleByDocx(0, ArticleTypeEnum.MARKDOWN)">docx文件</a-doption>
                            </a-tooltip>
                            <a-doption @click="importHtmlToMarkdown(0)">html文件</a-doption>
                            <a-doption @click="importTextToArticle(0, ArticleTypeEnum.MARKDOWN)">markdown文件</a-doption>
                        </template>
                    </a-dsubmenu>
                    <a-doption @click="importTextToArticle(0, ArticleTypeEnum.CODE)">代码文件</a-doption>
                    <a-tooltip content="导入压缩包中全部markdown文件，文件路径为文件名">
                        <a-doption @click="importArticleByZip(0)">zip文件</a-doption>
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
                        <a-doption @click="exportToMd(0)">导出为ZIP</a-doption>
                    </a-tooltip>
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
    exportToMd, importArticleByDocx, importArticleByZip,
    importHtmlToMarkdown,
    importTextToArticle
} from "@/pages/home/components/he-context";
</script>
<style scoped>

</style>
