<template>
    <div class="content">
        <main class="container kb-wang-editor">
            <div :id="toolbarId" ref="wangEditorToolbar"></div>
            <div :id="editorId" ref="wangEditorEl" :style="editorWrapperStyle">
            </div>
            <!-- 标签 -->
        </main>
        <footer class="footer">
            <div class="tags">
                <a-tag v-for="tag in item.tags" :key="tag" :color="randomColor(tag)" closable
                       @close="tagRemove(tag)" class="tag">{{ tag }}
                </a-tag>
                <a-input
                    v-if="tag.input"
                    ref="tagInputRef"
                    :style="{ width: '90px'}"
                    size="mini"
                    v-model.trim="tag.value"
                    @keyup.enter="tagAdd()"
                    @blur="tagAdd()"
                />
                <a-tag
                    v-else
                    @click="tagEdit()"
                >
                    <template #icon>
                        <icon-plus/>
                    </template>
                    新增标签
                </a-tag>
            </div>
            <main-content-attr/>
        </footer>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {createEditor, createToolbar, IDomEditor, IEditorConfig, IToolbarConfig, Toolbar} from '@wangeditor/editor';
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItemContent, TodoItemContent} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useElementSize} from "@vueuse/core";
import {randomColor} from "@/utils/BrowserUtil";
import {useImageUpload} from "@/plugin/image";
import MainContentAttr
    from "@/pages/todo/components/ContentDefault/layout/ContentDefaultMain/components/MainContent/MainContentAttr.vue";

type AlertType = 'success' | 'info' | 'warning' | 'error';
let lock = false;
let todo = false;


const wangEditorEl = ref<HTMLElement | null>(null);
const wangEditorToolbar = ref<HTMLElement | null>(null);

const size = useElementSize(wangEditorToolbar);

const now = new Date().getTime();
const editorId = ref('editor—wrapper-' + now);
const toolbarId = ref('editor-toolbar-' + now);

const item = ref<TodoItemContent>(getDefaultTodoItemContent());
let rev: undefined | string = undefined

const tagInputRef = ref<HTMLInputElement | null>(null);
const tag = ref({
    input: false,
    value: ''
});

let editor: IDomEditor | null = null;
let toolbar: Toolbar | null = null;

const editorWrapperStyle = computed(() => {
    return {
        height: `calc(100% - ${size.height.value}px)`
    }
})

type InsertFnType = (url: string, alt?: string, href?: string) => void

const editorConfig: IEditorConfig = {
    placeholder: '请输入待办内容',
    onChange(editor: IDomEditor) {
        item.value.content = editor.getHtml();
        autoSave();
    },
    customAlert: (info: string, type: AlertType) => {
        MessageUtil[type](info);
    },
    scroll: true,
    readOnly: false,
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


async function init() {
    // 获取内容
    const res = await useTodoStore().getTodoItemContent(useTodoStore().itemId);
    item.value = res.record;
    rev = res.rev;
    // 重新设置编辑器的值
}

// 内容的自动保存
const autoSave = () => {
    if (lock) {
        todo = true;
        return;
    }
    lock = true;
    useTodoStore().saveContent(useTodoStore().itemId, item.value, rev)
        .then(res => {
            rev = res;
            lock = false;
            if (todo) {
                todo = false;
                autoSave()
            }
        })
        .catch(e => {
            MessageUtil.error("自动保存内容失败", e);
            lock = false;
        });
};

function create() {
    if (!wangEditorEl.value || !wangEditorToolbar.value) {
        return;
    }
    editor = createEditor({
        selector: wangEditorEl.value,
        html: item.value.content,
        config: editorConfig,
        mode: 'simple', // or 'simple'
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

    toolbar = createToolbar({
        editor,
        selector: wangEditorToolbar.value,
        config: toolbarConfig,
        mode: 'simple', // 'default' or 'simple'
    });
}

onMounted(() => init().then(create));


onBeforeUnmount(() => {
    if (editor) {
        editor.destroy();
    }
    if (toolbar) {
        toolbar.destroy();
    }
});


function tagAdd() {
    tag.value.input = false;
    const temp = tag.value.value.trim();
    if (temp.length === 0) {
        return;
    }
    if (item.value.tags.indexOf(temp) === -1) {
        item.value.tags.push(temp);
        autoSave();
    }
}

function tagEdit() {
    tag.value = {
        input: true,
        value: ''
    }
    nextTick(() => {
        if (tagInputRef.value) {
            tagInputRef.value.focus();
        }
    })
}

function tagRemove(tag: string) {
    item.value.tags.splice(item.value.tags.indexOf(tag), 1);
    autoSave();
}


</script>
<style lang="less">

</style>
