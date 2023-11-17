<template>
    <div class="editor-container">
        <header class="ec-header">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu/>
                </template>
            </a-button>
            <div class="title">{{ title }}</div>
            <a-button-group class="btn">
                <a-button type="primary">
                    <template #icon>
                        <icon-save/>
                    </template>
                </a-button>
            </a-button-group>
        </header>
        <main class="ec-container">
            <markdown-editor v-model="content" :preview="false" ref="mdEditor"
                             v-if="isMarkdown && isInit"/>
            <monaco-editor v-model="content" :language="language" :read-only="false"
                           v-else-if="isInit"/>
        </main>
    </div>
</template>
<script lang="ts" setup>
import MarkdownEditor from "@/components/markdown-editor/index.vue";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {ref} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {renderLanguage} from "@/utils/FileUtil";

const isInit = ref(false);
const content = ref('');
const selectKey = useEditorDriverStore().selectKey;
const title = window.path.basename(selectKey);
const language = renderLanguage(window.path.extname(selectKey));
const isMarkdown = language === 'md' || language === 'markdown'

useEditorDriverStore().service.getArticle(selectKey)
        .then(text => {
            content.value = text;
            isInit.value = true;
        });

const switchCollapsed = () => useEditorDriverStore().switchCollapsed();

</script>
<style lang="less">
.editor-container {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;

    .ec-header {
        display: flex;
        padding: 7px;

        .title {
            line-height: 32px;
            font-size: 1.1em;
            font-weight: bold;
            padding-left: 7px;
            width: 70%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .btn {
            position: absolute;
            top: 7px;
            right: 7px;
        }
    }

    .ec-container {
        position: absolute;
        top: 46px;
        right: 7px;
        left: 7px;
        bottom: 7px;
        overflow: hidden;
    }
}
</style>
