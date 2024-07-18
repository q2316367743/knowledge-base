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
            <rich-text-editor v-model="content"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getDefaultTodoItem} from "@/entity/todo/TodoItem";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRoute, useRouter} from "vue-router";
import RichTextEditor from '@/editor/RichTextEditor/index.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const todoItem = ref(getDefaultTodoItem());
const content = ref('');

const id = parseInt(route.params.id as string);

onMounted(() => {
    useTodoStore().getTodoItem(id).then(res => {
        todoItem.value = res;
        content.value = res.content.record.content;
    });
});


function onSave() {
    loading.value = true;
    useTodoStore().updateContent(id, todoItem.value.index, {
        content: content.value
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
