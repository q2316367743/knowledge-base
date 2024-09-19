<template>
    <main class="edit-wang-editor kb-wang-editor">
        <div class="wang-editor-header" ref=editorHeaderDom></div>
        <div class="wang-editor-main" ref="editorContainerDom"></div>
    </main>
</template>
<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from "vue";
import {createEditor, createToolbar, IDomEditor, Toolbar} from '@wangeditor/editor'
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {useImageUploadByUtools} from "@/plugin/image";
import {renderAttachmentUrl} from "@/plugin/server";
import {onRichTextImport} from "@/editor/RichTextEditor/func";

type InsertFnType = (url: string, alt: string, href: string) => void

const content = defineModel({
    type: String,
    default: ''
})

const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false
    },
    articleId: Number
});

const editorHeaderDom = ref<HTMLDivElement>();
const editorContainerDom = ref<HTMLDivElement>();

const editorRef = shallowRef<IDomEditor>()
const toolbarRef = shallowRef<Toolbar>()

watch(() => props.readOnly, value => {
    value ? editorRef.value?.disable() : editorRef.value?.enable();
}, {immediate: true});

function init() {
    if (!editorHeaderDom.value || !editorHeaderDom.value) {
        return;
    }
    const editor = createEditor({
        selector: editorContainerDom.value,
        html: content.value,
        mode: 'default',
        config: {
            onChange: (editor: IDomEditor) => {
                content.value = editor.getHtml();
            },
            placeholder: '请输入内容...',
            readOnly: props.readOnly,
            MENU_CONF: {
                uploadImage: {
                    server: '/api/upload',
                    // 自定义上传
                    customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
                        useImageUploadByUtools(file)
                            .then(key => {
                                insertFn(renderAttachmentUrl(key), key, '')
                            })
                    }
                },
                uploadVideo: {
                    server: '/api/upload',
                    customUpload(file: File, insertFn: InsertFnType) {
                        useImageUploadByUtools(file)
                            .then(key => {
                                insertFn(renderAttachmentUrl(key), key, '')
                            })
                    }
                }
            }

        }
    });
    const toolbarConfig = {}

    const toolbar = createToolbar({
        editor,
        selector: editorHeaderDom.value,
        config: toolbarConfig,
        mode: 'default', // or 'simple'
    });

    editorRef.value = editor;
    toolbarRef.value = toolbar;
}


onMounted(() => {
    // 初始化
    init();
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
});

onBeforeUnmount(() => {
    useArticleExportEvent.off(onExport);
    toolbarRef.value?.destroy();
    editorRef.value?.destroy();
})


function onExport(id: number) {
    onRichTextImport(id, props.articleId, editorRef.value)
}

</script>
<style lang="less">
.edit-wang-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-bg-1);
    z-index: 1000;
    display: flex;
    flex-direction: column;

    .wang-editor-main {
        flex: 1;
        overflow: hidden;
    }
}
</style>
