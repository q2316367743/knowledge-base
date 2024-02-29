<template>
    <!-- 编辑区 -->
    <div class="ec-container">
        <markdown-editor v-model="content" :preview="preview" ref="mdEditor"
                         v-if="editorType === ArticleTypeEnum.MARKDOWN && articleAvailable"/>
        <wang-editor v-model="content" :read-only="preview" ref="weEditor"
                     v-else-if="editorType === ArticleTypeEnum.RICH_TEXT && articleAvailable"/>
        <monaco-editor v-model="content" :language="language" :read-only="preview"
                       v-else-if="editorType === ArticleTypeEnum.CODE && articleAvailable"/>
        <excel-editor v-model="content" :read-only="preview"
                      v-else-if="editorType === ArticleTypeEnum.EXCEL && articleAvailable"/>
    </div>
</template>
<script lang="ts" setup>
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import WangEditor from "@/pages/home/layout/editor-content/editor/wang-editor.vue";
import MonacoEditor from "@/pages/home/layout/editor-content/editor/monaco-editor/index.vue";
import MarkdownEditor from "@/pages/home/layout/editor-content/editor/markdown-editor/index.vue";
import {
    articleAvailable,
    articleIndex,
    content,
    editorType,
    language,
    preview
} from "@/store/components/HomeEditorStore";
import ExcelEditor from "@/pages/home/layout/editor-content/editor/ExcelEditor.vue";
</script>
<style scoped>

</style>
