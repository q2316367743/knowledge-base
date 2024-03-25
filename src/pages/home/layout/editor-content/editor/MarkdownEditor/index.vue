<template>
    <div class="markdown-editor" :id="id"></div>
</template>
<script lang="ts" setup>
import Cherry from "cherry-markdown";
import {onMounted, onBeforeUnmount, shallowRef, watch} from "vue";
import {
    editorProps
} from "@/pages/home/layout/editor-content/editor/MarkdownEditor/CherryMarkdownOption";
import {useWindowSize} from "@vueuse/core";

import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {
    useArticleExportEvent,
    useArticleImportEvent,
    useArticleInsertEvent,
    useHomeEditorStore
} from "@/store/components/HomeEditorStore";

import MessageUtil from "@/utils/modal/MessageUtil";
import {extname, parseFileName, readAsText} from "@/utils/file/FileUtil";
import {docxToMarkdown, htmlToMarkdown} from "@/utils/file/ConvertUtil";

import Constant from "@/global/Constant";

import {TocItem} from "./common/TocItem";
import {openMarkdownExport} from "./common/MarkdownExport";

import {openArticleImport} from "@/pages/home/layout/editor-content/components/ArticleImport";

import {buildConfig} from "@/pages/home/layout/editor-content/editor/MarkdownEditor/common/build-config";

const props = defineProps(editorProps);
const emits = defineEmits(['update:modelValue']);
defineExpose({exportFile, getToc})

const instance = shallowRef<Cherry>();
const id = 'markdown-editor-' + new Date().getTime();
const size = useWindowSize();


onMounted(() => {
    instance.value = new Cherry(buildConfig(props.articleId || 0, id, props.modelValue || '', props.preview, instance, e => emits('update:modelValue', e)));
    handleTheme();
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
    useArticleImportEvent.off(onImport);
    useArticleImportEvent.on(onImport);
    useArticleInsertEvent.off(onInsert);
    useArticleInsertEvent.on(onInsert);
});

onBeforeUnmount(() => {
    useArticleExportEvent.off(onExport);
    useArticleImportEvent.off(onImport);
    useArticleInsertEvent.off(onInsert);
});

watch(() => props.preview, handleToolbar);
watch(() => size.width.value, value => {
    if (instance.value) {
        if (useBaseSettingStore().mdEditorAutoMode && !props.preview) {
            instance.value.switchModel(value > Constant.autoCollapsedWidth ? 'edit&preview' : 'editOnly');
        }
    }
});
watch(() => useGlobalStore().isDark, value => {
    if (instance.value) {
        instance.value.setTheme(value ? 'dark' : 'default')
    }
})

function handleToolbar(value: boolean) {
    instance.value && instance.value.switchModel(value ? 'previewOnly' : useBaseSettingStore().defaultModel);
}

function handleTheme() {
    if (!instance.value) {
        return;
    }
    instance.value.setTheme(useGlobalStore().isDark ? 'dark' : 'default')
}

function exportFile(type: any, fileName: string) {
    if (instance.value) {
        instance.value.export(type, fileName);
    }
}


function getToc(): Array<TocItem> {
    if (instance.value) {
        return instance.value.getToc();
    } else {
        return [];
    }
}

function onExport(id: number) {
    if (props.articleId === id && instance.value) {
        openMarkdownExport(id, instance.value)
    }
}

function setValue(text: string, name: string, id: number) {
    instance.value && instance.value.setValue(text);
    const fileName = parseFileName(name);
    useArticleStore().updateIndex(id, {
        name: fileName
    }).then(() => useHomeEditorStore().updateTitle(id, fileName));
}

function onImport(id: number) {

    if (props.articleId === id && instance.value) {
        openArticleImport(['.md', '.markdown', '.html', '.docx'])
            .then(file => {
                const ext = extname(file.name);
                if (ext === 'md' || ext === 'markdown' || ext === 'html') {
                    readAsText(file).then(text => {
                        if (ext === 'html') {
                            text = htmlToMarkdown(text);
                        } else if (ext !== 'md' && ext !== 'markdown') {
                            MessageUtil.warning("文件类型不支持");
                            return;
                        }
                        setValue(text, file.name, id);
                    })
                } else if (ext === 'docx') {
                    file.arrayBuffer().then(arrayBuffer =>
                        docxToMarkdown(arrayBuffer).then(text =>
                            setValue(text, file.name, id)))
                }
            });
    }

}

function onInsert(data: { id: number, content: string }) {
    if (props.articleId === data.id && instance.value) {
        instance.value.setValue(instance.value.getValue() + data.content);
    }

}

</script>
<style lang="less">
.markdown-editor {
    position: relative;
    height: 100%;
    width: 100%;
}

.cherry {
    background-color: var(--color-bg-1);
    color: var(--color-text-1);

    .cherry-previewer {
        a {
            color: rgb(var(--arcoblue-6));
        }
    }
}
</style>
