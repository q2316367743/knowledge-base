<template>
    <div class="editor-container">
        <header class="ec-header" v-if="isInit">
            <a-button type="text" @click="switchCollapsed()">
                <template #icon>
                    <icon-menu-unfold v-if="collapsed" />
                    <icon-menu-fold v-else/>
                </template>
            </a-button>
            <div class="title">{{ title }}</div>
            <a-button-group class="btn">
                <a-button type="primary" :loading="saveLoading" @click="save()">
                    <template #icon>
                        <icon-save/>
                    </template>
                </a-button>
            </a-button-group>
        </header>
        <main class="ec-container" v-if="isInit">
            <markdown-editor v-model="content" :preview="false" ref="mdEditor"
                             v-if="isMarkdown && isInit"/>
            <monaco-editor v-model="content" :language="language" :read-only="false"
                           v-else-if="isInit"/>
        </main>
        <a-result v-if="!isInit" title="正在获取文章内容" style="margin-top: 20vh;">
            <template #icon>
                <icon-loading spin/>
            </template>
            <template #extra>
                <a-button type="primary" @click="switchCollapsed()">
                    <template #icon>
                        <icon-menu/>
                    </template>
                </a-button>
            </template>
        </a-result>
    </div>
</template>
<script lang="ts" setup>
import MarkdownEditor from "@/components/markdown-editor/index.vue";
import MonacoEditor from "@/components/monaco-editor/index.vue";
import {computed, ref} from "vue";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {basename, extname, renderLanguage} from "@/utils/FileUtil";
import MessageUtil from "@/utils/MessageUtil";

const isInit = ref(false);
const content = ref('');
const saveLoading = ref(false);
const selectKey = useEditorDriverStore().selectKey;
const title = basename(selectKey);
const language = renderLanguage(extname(selectKey));
const isMarkdown = language === 'md' || language === 'markdown';
const collapsed = computed(() => useEditorDriverStore().collapsed);

useEditorDriverStore().service.getFile(selectKey)
        .then(text => {
            content.value = text;
            isInit.value = true;
        });

const switchCollapsed = () => useEditorDriverStore().switchCollapsed();

function save() {
    saveLoading.value = true;
    useEditorDriverStore().service.saveFile(selectKey, content.value)
            .then(() => MessageUtil.success("保存成功"))
            .catch(e => MessageUtil.error("保存失败", e))
            .finally(() => saveLoading.value = false);
}

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
        padding: 4px;

        .title {
            line-height: 28px;
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
            top: 4px;
            right: 4px;
        }
    }

    .ec-container {
        position: absolute;
        top: 40px;
        right: 7px;
        left: 7px;
        bottom: 7px;
        overflow: hidden;
    }
}
</style>
