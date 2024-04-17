<template>
    <div class='card-todo-info'>
        <div class='header'>
            <a-button type='text' @click="onClose()" :loading="loading">
                <template #icon>
                    <icon-left/>
                </template>
            </a-button>
            <a-input allow-clear v-model="todoItem.index.title" :disabled="loading"/>
            <a-button type='text' style='margin-left: 7px;' @click="onSave"
                      :loading="loading">
                <template #icon>
                    <icon-save/>
                </template>
            </a-button>
        </div>
        <div class='container kb-wang-editor'>
            <div class='editor' ref='editorRef'/>
        </div>
    </div>
</template>
<script lang="ts" setup>

import {onMounted, onUnmounted, ref, shallowRef} from "vue";
import {getDefaultTodoItem} from "@/entity/todo/TodoItem";
import {IDomEditor} from "@wangeditor/editor";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRoute, useRouter} from "vue-router";
import {buildRickText} from "@/nested/todo/pages/info/func";

const route = useRoute();
const router = useRouter();

const editorRef = ref();
const loading = ref(false);
const todoItem = ref(getDefaultTodoItem());
const editor = shallowRef<IDomEditor>()

const id = parseInt(route.params.id as string);

onMounted(() => {
    useTodoStore().getTodoItem(id).then(res => {
        todoItem.value = res;
        editor.value = buildRickText(editorRef, value => {
            todoItem.value.content.record.content = value;
        });
        editor.value.setHtml(res.content.record.content);
    });
});

onUnmounted(() => {
    editor.value && editor.value.destroy();
})

function onSave() {
    loading.value = true;
    useTodoStore().updateContent(id, todoItem.value.index, {
        content: todoItem.value.content.record.content
    })
        .then(() => {
            MessageUtil.success("保存成功")
            onClose();
        })
        .catch(e => MessageUtil.error("保存失败", e))
        .finally(() => loading.value = false);
}

function onClose() {
    router.push('/home')
}
</script>
<style scoped lang="less">
.card-todo-info {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--color-text-1);
    padding: 7px;
    .header {
        width: 100%;
        display: grid;
        grid-template-columns: 31px 1fr 31px;
    }
    .container {
        position: absolute;
        top: 38px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        overflow: hidden;
        .editor {
            position: relative;
            height: 100%;
            width: 100%;
        }
    }
}

</style>
