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
import {download} from "@/utils/BrowserUtil";
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import {htmlToDocByDownload, htmlToMarkdown} from "@/utils/file/ConvertUtil";
import {AiEditor, OpenaiModelConfig} from "aieditor";
import {useGlobalStore} from "@/store/GlobalStore";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";

const content = defineModel({
    type: String
})

const props = defineProps({
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);
defineExpose({getToc})


const editorDom = ref<HTMLDivElement>();

let editor: AiEditor | null = null;

watch(() => props.readOnly, value => {
    if (editor) {
        if (value) {
            editor.setEditable(false);
        } else {
            editor.setEditable(true);
        }
    }
})


function create() {
    if (!editorDom.value) {
        return;
    }
    const {isDark} = useGlobalStore();

    const {chatSetting, enable} = useChatSettingStore();
    const models: Record<string, OpenaiModelConfig> = {};
    if (enable) {
        models['openai'] = {
            apiKey: chatSetting.token,
            endpoint: chatSetting.api,
            model: chatSetting.model
        }
    }
    editor = new AiEditor({
        element: editorDom.value as Element,
        placeholder: "请输入笔记内容",
        content: content.value,
        theme: isDark ? 'dark' : 'light',
        ai: {
            models
        },
        onChange(editor) {
            content.value = editor.getHtml();
        },
    })
}

onMounted(() => {
    create();
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
});

onBeforeUnmount(() => {
    editor && editor.destroy();
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
            if (editor) {
                if (res.type === 1) {
                    download(htmlToMarkdown(editor.getHtml()), res.title, 'text/plain;charset=utf-8');
                } else if (res.type === 2) {
                    download(editor.getHtml(), res.title, 'text/html;charset=utf-8');
                } else if (res.type === 3) {
                    download(editor.getText(), res.title, 'text/html;charset=utf-8');
                } else if (res.type === 4) {
                    htmlToDocByDownload(`<html lang="zh"><body>${editor.getHtml()}</body></html>`, res.title);
                }
            }
        })
    }
}

function getToc(): Array<TocItem> {
    return [];
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
