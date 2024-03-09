<template>
    <div class="todo-item-content">
        <a-result v-if="itemId === 0" status="404" title="请选择待办项"/>
        <a-typography v-show="itemId !== 0">
            <header class="header">
                <!-- 标题 -->
                <div class="title">
                    <a-input v-model="item.index.title" allow-clear placeholder="待办标题，回车修改"
                             @keydown.enter="updateTitle()"/>
                </div>
                <!-- 优先级 -->
                <a-dropdown position="br" @select="updatePriority($event)">
                    <a-button type="dashed" :style="{color: color}" class="priority">
                        <template #icon>
                            <icon-thunderbolt/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                                   :value="TodoItemPriority.HIGH">
                            高优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                                   :value="TodoItemPriority.MIDDLE">
                            中优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                                   :value="TodoItemPriority.FLOOR">
                            低优先级
                        </a-doption>
                        <a-doption :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                                   :value="TodoItemPriority.NONE">
                            无优先级
                        </a-doption>
                    </template>
                </a-dropdown>
            </header>
            <main class="item-container kb-wang-editor">
                <div id="toolbar-container"></div>
                <div id="todo-editor—wrapper">
                </div>
                <!-- 标签 -->
                <div class="todo-item-tags">
                    <a-tag v-for="tag in tags" :key="tag" :color="randomColor(tag)" closable
                           @close="tagRemove(tag)">{{ tag }}
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
            </main>
            <footer class="footer">
                <div></div>
                <a-button type="text">
                    <template #icon>
                        <icon-more-vertical/>
                    </template>
                </a-button>
            </footer>
            <div class="auto-save" v-if="autoSaveLoading">
                <icon-refresh spin/>
                自动保存中
            </div>
        </a-typography>
        <a-back-top target-container=".todo-item-content .item-container" style="bottom:56px"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, onMounted, onBeforeUnmount, ref, toRaw, watch} from "vue";
import {createEditor, createToolbar, IDomEditor, IEditorConfig, IToolbarConfig, Toolbar} from '@wangeditor/editor';
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItem, handlePriorityColor, TodoItem, TodoItemPriority} from "@/entity/todo/TodoItem";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useMagicKeys} from "@vueuse/core";
import {randomColor} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";
import {useImageUpload} from "@/plugin/image";

type AlertType = 'success' | 'info' | 'warning' | 'error';
let lock = false;
let todo = false;

const {ctrl, s} = useMagicKeys();

let isInit = false;

const item = ref<TodoItem>(getDefaultTodoItem());
const autoSaveLoading = ref(false);
const tagInputRef = ref<HTMLInputElement | null>(null);
const tag = ref({
    input: false,
    value: ''
});

let editor: IDomEditor | null = null;
let toolbar: Toolbar | null = null;

const itemId = computed(() => useTodoStore().itemId);
const color = computed(() => handlePriorityColor(item.value.index.priority));
const createTime = computed(() => toDateString(item.value.index.createTime, "yyyy-MM-dd HH:mm:ss"));
const tags = computed(() => item.value.content.record.tags);

type InsertFnType = (url: string, alt?: string, href?: string) => void

const editorConfig: IEditorConfig = {
    placeholder: '请输入待办内容',
    onChange(editor: IDomEditor) {
        item.value.content.record.content = editor.getHtml();
        autoSave();
    },
    customAlert: (info: string, type: AlertType) => {
        MessageUtil[type](info);
    },
    scroll: false,
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

init(itemId.value);

function init(id: number) {
    if (id === 0) {
        return;
    }
    // 获取内容
    useTodoStore().getTodoItem(id)
        .then(value => {
            item.value = value;
            // 重新设置编辑器的值
            if (editor) {
                try {
                    editor.setHtml(item.value.content.record.content);
                } catch (e) {
                    console.error("编辑器赋值错误，重新创建");
                    editor.destroy();
                    create();
                }
            }
            isInit = true;
        })
        .catch(e => MessageUtil.error("获取待办内容失败", e))
}

// 内容的自动保存
const autoSave = () => {
    if (!isInit) {
        // 未初始化，不进行保存
        return;
    }
    if (lock) {
        todo = true;
        return;
    }
    autoSaveLoading.value = true;
    lock = true;
    useTodoStore().saveContent(itemId.value, {
        ...item.value.content.record,
        tags: toRaw(item.value.content.record.tags)
    }, item.value.content.rev)
        .then(rev => {
            item.value.content.rev = rev;
            lock = false;
            if (todo) {
                todo = false;
                autoSave()
            }
        })
        .catch(e => MessageUtil.error("自动保存内容失败", e))
        .finally(() => autoSaveLoading.value = false);
};

function create() {
    editor = createEditor({
        selector: '#todo-editor—wrapper',
        html: item.value.content.record.content,
        config: editorConfig,
        mode: 'simple', // or 'simple'
    });
    editor.setHtml(item.value.content.record.content);
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
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'simple', // 'default' or 'simple'
    });
}

onMounted(() => create());


onBeforeUnmount(() => {
    if (editor) {
        editor.destroy();
    }
    if (toolbar) {
        toolbar.destroy();
    }
});

function updatePriority(priority: any) {
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId.value, {priority})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

function updateTitle() {
    useTodoStore().updateById(item.value.index.id, {title: item.value.index.title})
        .catch(e => MessageUtil.error("更新标题失败", e));
}

watch(() => s.value, value => {
    if (value && ctrl.value) {
        updateTitle();
        autoSave()
    }
});

watch(() => item.value.index.title, () => updateTitle());

function tagAdd() {
    tag.value.input = false;
    if (tag.value.value.trim().length === 0) {
        return;
    }
    const temp = tag.value.value.trim();
    if (item.value.content.record.tags.indexOf(temp) === -1) {
        item.value.content.record.tags.push(temp);
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
    item.value.content.record.tags.splice(item.value.content.record.tags.indexOf(tag), 1);
    autoSave();
}


</script>
<style lang="less">
.todo-item-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;

    .header {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 7px;

        .title {
            position: absolute;
            top: 0;
            left: 0;
            right: 39px;
        }

        .priority {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    .item-container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 46px;
        overflow: auto;
        overflow-x: hidden;


        .todo-item-tags {
            width: 100%;
            flex-wrap: wrap;

            .arco-tag {
                margin: 4px 7px;
            }
        }
    }

    .footer {
        position: absolute;
        left: 7px;
        right: 7px;
        bottom: 7px;
        display: flex;
        justify-content: space-between;
    }

    .auto-save {
        position: absolute;
        top: 53px;
        right: 7px;
        color: rgb(var(--arcoblue-6));
        line-height: 32px;

    }

}

#todo-editor—wrapper {
    p:last-child {
        padding-bottom: 15px;
    }
}
</style>
