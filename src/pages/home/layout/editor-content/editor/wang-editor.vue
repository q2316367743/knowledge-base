<template>
    <main class="edit-wang-editor kb-wang-editor" ref="wangEditorEl">
        <div :id="toolbarId" v-show="!props.readOnly" ref="wangEditorToolbar"></div>
        <div :id="editorId" :style="editorWrapperStyle">
        </div>
    </main>
</template>
<script lang="ts" setup>
import {createEditor, createToolbar, IDomEditor, IEditorConfig, IToolbarConfig, SlateNode, Toolbar} from "@wangeditor/editor";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TocItem} from "@/pages/home/layout/editor-content/editor/markdown-editor/common/TocItem";
import {useImageUpload} from "@/plugin/image";
import {useElementSize} from "@vueuse/core";
import {getLineLength, getTextCount, useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {createArticleExport} from "@/pages/home/layout/editor-content/components/ArticleExport";
import {download} from "@/utils/BrowserUtil";
import {htmlToMarkdown} from "@/utils/file/ConvertUtil";

type AlertType = 'success' | 'info' | 'warning' | 'error';

const props = defineProps({
    modelValue: String,
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);
defineExpose({getToc})

const content = ref(`${props.modelValue}` || '');
const wangEditorEl = ref<HTMLElement | null>(null);
const wangEditorToolbar = ref<HTMLElement | null>(null);

const now = new Date().getTime();
const editorId = ref('editor—wrapper-' + now);
const toolbarId = ref('editor-toolbar-' + now);

const size = useElementSize(wangEditorToolbar);

const editorWrapperStyle = computed(() => {
    let height = '100%';
    if (!props.readOnly) {
        // 双层
        height = `calc(100% - ${size.height.value}px)`;
    }
    return {
        height: height
    }
});

watch(() => content.value, value => emits('update:modelValue', value));
watch(() => props.modelValue, value => content.value = value || '');
watch(() => props.readOnly, value => {
    if (editor) {
        if (value) {
            editor.disable();
        } else {
            editor.enable();
        }
    }
})

let editor: IDomEditor | null = null;
let toolbar: Toolbar | null = null;
type InsertFnType = (url: string, alt?: string, href?: string) => void
const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入笔记内容',
    onChange(editor: IDomEditor) {
        content.value = editor.getHtml();
    },
    customAlert: (info: string, type: AlertType) => {
        MessageUtil[type](info);
    },
    scroll: true,
    readOnly: props.readOnly || false,
    autoFocus: false,
    MENU_CONF: {
        uploadImage: {
            customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
                // async customUpload(file, insertFn) {                   // JS 语法
                // file 即选中的文件
                // 自己实现上传，并得到图片 url alt href
                useImageUpload(file)
                    .then(url => {
                        if (url) {
                            // 最后插入图片
                            insertFn(url, file.name || "默认图片");
                        }
                    })
            }
        }
    }
}

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


function create() {
    const instance = createEditor({
        selector: '#' + editorId.value,
        html: content.value,
        config: editorConfig,
        mode: 'default', // or 'simple'
    });
    toolbar = createToolbar({
        editor: instance,
        selector: '#' + toolbarId.value,
        config: toolbarConfig,
        mode: 'simple', // 'default' or 'simple'
    });
    getTextCount.value = () => instance.getText().length;
    getLineLength.value = () => instance.getText().split("\n").length;

    editor = instance;
}

onMounted(() => {
    create();
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
});

onBeforeUnmount(() => {
    editor && editor.destroy();
    toolbar && toolbar.destroy();
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
        }]).then(res => {
            if (editor) {
                if (res.type === 1) {
                    download(htmlToMarkdown(editor.getHtml()), res.title, 'text/plain;charset=utf-8');
                }else if (res.type === 2) {
                    download(editor.getHtml(), res.title, 'text/html;charset=utf-8');
                }else if (res.type === 3) {
                    download(editor.getText(), res.title, 'text/html;charset=utf-8');
                }
            }
        })
    }
}

function getToc(): Array<TocItem> {
    if (editor) {
        const headers = editor.getElemsByTypePrefix("header");
        return headers.map(header => {
            let level = 1;
            try {
                level = parseInt(((header as any)['type'] as string).replace("header", ""));
            } catch (e) {
                console.error(e);
            }
            return {
                id: header.id,
                level: level,
                text: SlateNode.string(header)
            };
        })
    } else {
        return [];
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

    #editor—wrapper {
        height: calc(100% - 40px);
    }

}
</style>
