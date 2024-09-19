<template>
    <main class="edit-wang-editor kb-wang-editor">
        <div ref="editorDom" class="aie-container">
            <div class="aie-container-header"></div>
            <div class="aie-container-main"></div>
            <div class="aie-container-footer"></div>
        </div>
    </main>
</template>
<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
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
defineExpose({getToc, setContent})


const editorDom = ref<HTMLDivElement>();


watch(() => props.readOnly, value => {
});


onMounted(() => {
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

function getToc(): Array<TocItem> {
    return [];
}

function setContent(text: string) {
}


</script>
<style lang="less">
.edit-wang-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

}

.aie-container {
    margin: 0;
    border: none;
}
</style>
