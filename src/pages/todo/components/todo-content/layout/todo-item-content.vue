<template>
    <div class="todo-item-content">
        <a-result v-if="itemId === 0" status="404" title="请选择待办项"/>
        <a-typography v-show="itemId !== 0">
            <header>
                <a-input v-model="item.index.title" allow-clear/>
            </header>
            <main class="item-container">
                <div id="todo-editor—wrapper">
                </div>
            </main>
        </a-typography>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {createEditor, IDomEditor, IEditorConfig} from '@wangeditor/editor';
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItem, TodoItem} from "@/entity/todo/TodoItem";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {debounce} from "xe-utils";
import {saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

type AlertType = 'success' | 'info' | 'warning' | 'error';
let lock = false;
let todo = false;

const item = ref<TodoItem>(getDefaultTodoItem());
let editor: IDomEditor | null = null;

const itemId = computed(() => useTodoStore().itemId);


watch(() => itemId.value, value => init(value));
init(itemId.value);

function init(id: number) {
    if (id === 0) {
        return;
    }
    // 获取内容
    useGlobalStore().startLoading("获取待办内容中");
    useTodoStore().getTodoItem(id)
        .then(value => {
            item.value = value;
            // 重新设置编辑器的值
            if (editor) {
                editor.setHtml(item.value.content.record.content);
            }
        })
        .catch(e => MessageUtil.error("获取待办内容失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

// 内容的自动保存
const autoSave = debounce(() => {
    if (lock) {
        todo = true;
        return;
    }
    lock = true;
    saveOneByAsync(LocalNameEnum.TODO_ITEM + itemId.value, item.value.content.record, item.value.content.rev)
        .then(rev => {
            item.value.content.rev = rev;
            lock = false;
            if (todo) {
                todo = false;
                autoSave()
            }
        })
        .catch(e => MessageUtil.error("自动保存内容失败", e));
}, 1000);

onMounted(() => {
    const editorConfig: IEditorConfig = {
        placeholder: '请输入待办内容',
        onChange(editor: IDomEditor) {
            item.value.content.record.content = editor.getHtml();
            autoSave();
        },
        customAlert: (info: string, type: AlertType) => {
            MessageUtil[type](info);
        },
        scroll: true,
        readOnly: false,
        autoFocus: false,
    }

    editor = createEditor({
        selector: '#todo-editor—wrapper',
        html: item.value.content.record.content,
        config: editorConfig,
        mode: 'default', // or 'simple'
    })

})

</script>
<style lang="less">
.todo-item-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;

    .item-container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;

    }
}

#todo-editor—wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: text;
    .w-e-text-container {
        background-color: var(--color-bg-1) !important;
        color: var(--color-text-1) !important;
    }
}
</style>
