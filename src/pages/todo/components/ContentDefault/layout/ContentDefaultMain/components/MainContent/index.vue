<template>
    <div class="content">
        <main class="container kb-wang-editor">
            <rich-text-editor v-model="item.content"/>
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
import {nextTick, onMounted, ref, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import {getDefaultTodoItemContent, TodoItemContent} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";
import {randomColor} from "@/utils/BrowserUtil";
import MainContentAttr
    from "@/pages/todo/components/ContentDefault/layout/ContentDefaultMain/components/MainContent/MainContentAttr.vue";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";

let lock = false;
let todo = false;




const item = ref<TodoItemContent>(getDefaultTodoItemContent());
let rev: undefined | string = undefined

const tagInputRef = ref<HTMLInputElement | null>(null);
const tag = ref({
    input: false,
    value: ''
});


async function init() {
    // 获取内容
    const res = await useTodoStore().getTodoItemContent(useTodoStore().itemId);
    item.value = res.record;
    rev = res.rev;
    // 重新设置编辑器的值
    watch(() => item.value.content, () => autoSave());
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


onMounted(() => init());

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
