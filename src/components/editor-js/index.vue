<template>
    <div id="editor-js-editor"></div>
</template>
<script lang="ts" setup>
import './index.less';
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header/dist/bundle.js';
// @ts-ignore
import List from '@editorjs/list/dist/bundle.js';
// @ts-ignore
import Table from '@editorjs/table/dist/table.js';
import {onMounted, onUnmounted, PropType, watch} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";

const props = defineProps({
    modelValue: Object as PropType<any>
});
const emits = defineEmits(['update:modelValue']);

let editor: EditorJS | null = null;

onMounted(() => {
    let data = props.modelValue;
    if (editor) {
        if (!data['version']) {
            data  = {
                "time": new Date().getTime(),
                "blocks": [],
                "version": "2.29.0-rc.1"
            };
        }
    }
    editor = new EditorJS({
        holder: 'todo-editor—wrapper',
        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        tools: {
            header: {
                class: Header,
                inlineToolbar: true
            },
            list: {
                class: List,
                inlineToolbar: true
            },
            table: {
                class: Table,
            }
        },
        data: data,
        /**
         * onChange callback
         */
        onChange: (api) => {
            api.saver.save().then(data => emits('update:modelValue', data))
        }
    });
});


onUnmounted(() => {
    if (editor) {
        editor.destroy();
    }
});
</script>
<style scoped>

</style>
