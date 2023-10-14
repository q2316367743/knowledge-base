<template>
    <div id="editor-js-editor"></div>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, PropType, watch} from "vue";
import './index.less';
import EditorJS from '@editorjs/editorjs';
// 组件
import Header from '@editorjs/header/dist/bundle.js';
import List from '@editorjs/list/dist/bundle.js';
import Table from '@editorjs/table/dist/table.js';
import Attaches from '@editorjs/attaches/dist/bundle.js';
import CheckList from '@editorjs/checklist/dist/bundle.js';
import Code from '@editorjs/code/dist/bundle.js';
import Image from '@editorjs/image/dist/bundle.js';
import InlineCode from '@editorjs/inline-code/dist/bundle.js';
import Link from '@editorjs/link/dist/bundle.js';
import LinkAutoComplete from '@editorjs/link-autocomplete/dist/link-autocomplete.js';
import Marker from '@editorjs/marker/dist/bundle.js';
import Quote from '@editorjs/quote/dist/bundle.js';
import Raw from '@editorjs/raw/dist/bundle.js';
import Underline from '@editorjs/underline/dist/bundle.js';
import Warning from '@editorjs/warning/dist/bundle.js';
import {UtoolsImage} from './plugins/UtoolsImage';

const props = defineProps({
    modelValue: Object as PropType<any>,
    readOnly: {
        type: Boolean,
        required: false,
        default: false
    }
});
const emits = defineEmits(['update:modelValue']);

let editor: EditorJS | null = null;

onMounted(() => {
    let data = {
        "time": new Date().getTime(),
        "blocks": [],
        "version": "2.29.0-rc.1"
    };
    if (typeof props.modelValue === 'object' && data['version']) {
        data = props.modelValue;
    }
    editor = new EditorJS({
        holder: 'editor-js-editor',
        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        tools: {
            header: {
                class: Header,
                inlineToolbar: true
            },
            InlineCode: {
                class: InlineCode,
                inlineToolbar: true
            },
            Link: {
                class: Link,
                inlineToolbar: true
            },
            LinkAutoComplete: {
                class: LinkAutoComplete,
                inlineToolbar: true
            },
            Marker: {
                class: Marker,
                inlineToolbar: true
            },
            Underline: {
                class: Underline,
                inlineToolbar: true
            },
            list: List,
            checklist: CheckList,
            Quote: Quote,
            Warning: Warning,
            table: Table,
            Code: Code,
            Raw: Raw,
            UtoolsImage: UtoolsImage,
            Image: Image,
            Attaches: Attaches,
        },
        data: data,
        /**
         * onChange callback
         */
        onChange: (api) => {
            api.saver.save()
                .then(data => emits('update:modelValue', data))
                .catch(e => console.error('保存失败', e))
        },
        readOnly: props.readOnly
    });
});

watch(() => props.readOnly, value => {
    if (editor) {
        if (editor.readOnly.isEnabled !== value) {
            editor.readOnly.toggle();
        }
    }
})

onUnmounted(() => {
    if (editor) {
        try {
            editor.destroy();
        } catch (e) {
            console.error(e);
        }
    }
});
</script>
<style scoped>

</style>
