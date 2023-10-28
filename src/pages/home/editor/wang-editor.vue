<template>
    <main class="edit-wang-editor kb-wang-editor">
        <div id="editor-toolbar"></div>
        <div id="editor—wrapper">
        </div>
    </main>
</template>
<script lang="ts" setup>
import {createEditor, createToolbar, IDomEditor, IEditorConfig, IToolbarConfig} from "@wangeditor/editor";
import {onMounted, ref, watch} from "vue";
import MessageUtil from "@/utils/MessageUtil";

type AlertType = 'success' | 'info' | 'warning' | 'error';

const props = defineProps({
    modelValue: String,
    readOnly: Boolean
});
const emits = defineEmits(['update:modelValue']);

const content = ref(`${props.modelValue}` || '');

watch(() => content.value, value => emits('update:modelValue', value));
watch(() => props.modelValue, value => content.value = value || '');

let editor: IDomEditor | null = null;
const editorConfig: IEditorConfig = {
    placeholder: '请输入笔记内容',
    onChange(editor: IDomEditor) {
        content.value = editor.getHtml();
    },
    customAlert: (info: string, type: AlertType) => {
        MessageUtil[type](info);
    },
    scroll: true,
    readOnly: false,
    autoFocus: false,
}

function create() {
    editor = createEditor({
        selector: '#editor—wrapper',
        html: content.value,
        config: editorConfig,
        mode: 'default', // or 'simple'
    });
    const toolbarConfig: Partial<IToolbarConfig> = {
        toolbarKeys: ["blockquote", "header1", "header2", "header3", "|",
            "bold", "underline", "italic", "through", "color", "bgColor", "clearStyle", "|",
            "bulletedList", "numberedList", "todo",
            {
                "key": "group-layout",
                "title": "对齐",
                "iconSvg": "<svg class=\"icon\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\"><path d=\"M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h682.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z\" ></path></svg>",
                "menuKeys": ["justifyLeft", "justifyRight", "justifyCenter"]
            }, "|",
            "insertLink",
            {
                "key": "group-image",
                "title": "图片",
                "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
                "menuKeys": ["insertImage", "uploadImage"]
            },
            "insertVideo", "insertTable", "codeBlock"]
    }

    const toolbar = createToolbar({
        editor,
        selector: '#editor-toolbar',
        config: toolbarConfig,
        mode: 'simple', // 'default' or 'simple'
    });
}

onMounted(() => create());

</script>
<style lang="less">
.edit-wang-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    #editor—wrapper {
        height: calc(100% - 40px);
    }

}
</style>
