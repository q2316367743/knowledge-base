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
            <main class="item-container">
                <div id="todo-editor—wrapper">
                </div>
                <div class="auto-save" v-if="autoSaveLoading">
                    <icon-refresh spin/>
                    自动保存中
                </div>
            </main>
        </a-typography>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {createEditor, IDomEditor, IEditorConfig} from '@wangeditor/editor';
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItem, handlePriorityColor, TodoItem, TodoItemPriority} from "@/entity/todo/TodoItem";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useMagicKeys} from "@vueuse/core";

type AlertType = 'success' | 'info' | 'warning' | 'error';
let lock = false;
let todo = false;

const {ctrl, s} = useMagicKeys()

const item = ref<TodoItem>(getDefaultTodoItem());
const autoSaveLoading = ref(false);

let editor: IDomEditor | null = null;

const itemId = computed(() => useTodoStore().itemId);
const color = computed(() => handlePriorityColor(item.value.index.priority));


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
                editor.clear();
                editor.setHtml("<p></p>")
                editor.setHtml(item.value.content.record.content);
            }
        })
        .catch(e => MessageUtil.error("获取待办内容失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

// 内容的自动保存
const autoSave = () => {
    if (lock) {
        todo = true;
        return;
    }
    autoSaveLoading.value = true;
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
        .catch(e => MessageUtil.error("自动保存内容失败", e))
        .finally(() => autoSaveLoading.value = false);
};

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

});

onUnmounted(() => {
    if (editor) {
        editor.destroy();
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
    useGlobalStore().startLoading("开始更新待办项");
    useTodoStore().updateById(itemId.value, {title: item.value.index.title})
        .then(() => MessageUtil.success("更新成功"))
        .catch(e => MessageUtil.error("更新失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

watch(() => s.value, value => {
    if (value && ctrl.value) {
        updateTitle();
        autoSave()
    }
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
        bottom: 7px;

        .auto-save {
            position: absolute;
            top: 7px;
            right: 7px;
            color: rgb(var(--arcoblue-6));
            line-height: 32px;

        }
    }

}

#todo-editor—wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .w-e-text-container {
        background-color: var(--color-bg-1) !important;
        color: var(--color-text-1) !important;
    }
}
</style>
