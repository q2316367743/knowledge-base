<template>
    <main class="edit-wang-editor kb-wang-editor">
        <div class="wang-editor-header" ref=editorHeaderDom></div>
        <div class="wang-editor-main" ref="editorContainerDom"></div>
    </main>
</template>
<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, shallowRef, watch} from "vue";
import {createEditor, createToolbar, IDomEditor, Toolbar} from '@wangeditor/editor'
import {TocItem} from "@/editor/types/TocItem";
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";

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
    if(!editorHeaderDom.value || !editorHeaderDom.value) {
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
})


function onExport(id: number) {
    if (props.articleId === id) {
        createArticleExport(id, [{
            key: 1,
            name: 'Markdown',
            desc: '便于分享'
        }, {
            key: 2,
            name: 'HTML',
            desc: '便于发布'
        }, {
            key: 3,
            name: '纯文本',
            desc: '便于阅读'
        }, {
            key: 4,
            name: 'Word文档',
            desc: '便于阅读'
        }]).then(res => {
        })
    }
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
