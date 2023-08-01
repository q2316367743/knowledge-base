<template>
    <Editor :value="value" :plugins="plugins" @change="handleChange" :locale="zhHans" placeholder="请输入文章内容"/>
</template>
<script lang="ts">
import {defineComponent, markRaw} from "vue";
import {Editor} from '@bytemd/vue-next';
import zhHans from 'bytemd/locales/zh_Hans.json';

import gfm from '@bytemd/plugin-gfm'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import highlight from '@bytemd/plugin-highlight'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
import imageZoom from '@ziuchen/bytemd-plugin-image-zoom'
import align from '@ziuchen/bytemd-plugin-align'
import highlightTheme from '@ziuchen/bytemd-plugin-highlight-theme'
import markdownTheme from '@ziuchen/bytemd-plugin-markdown-theme'
import highlights from '@ziuchen/bytemd-plugin-highlight-theme/dist/highlights.json'
import themes from '@ziuchen/bytemd-plugin-markdown-theme/dist/themes.json'
import zhHansGfm from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import zhHansMath from '@bytemd/plugin-math/locales/zh_Hans.json'
import zhHansMerimaid from '@bytemd/plugin-mermaid/locales/zh_Hans.json'
import zhHansImageZoom from '@ziuchen/bytemd-plugin-image-zoom/locales/zh_Hans.json'
import zhHansAlign from '@ziuchen/bytemd-plugin-align/locales/zh_Hans.json'
import zhHansHighlightTheme from '@ziuchen/bytemd-plugin-highlight-theme/locales/zh_Hans.json'
import zhHansMarkdownTheme from '@ziuchen/bytemd-plugin-markdown-theme/locales/zh_Hans.json'
import {useSettingStore} from "@/store/db/SettingStore";
import {enhancePlugin} from "@/components/markdown-editor/plugins/enhancePlugin";
import {imageUploadPlugin} from "@/components/markdown-editor/plugins/imageUploadPlugin";
import {customImagePlugin} from "@/components/markdown-editor/plugins/customImagePlugin";
import {pasteImagePlugin} from "@/components/markdown-editor/plugins/pasteImagePlugin";

const plugins = [
    gfm({
        locale: zhHansGfm
    }),
    gemoji(),
    breaks(),
    frontmatter(),
    highlight(),
    mediumZoom(),
    align({
        locale: zhHansAlign
    }),
    imageZoom({
        locale: zhHansImageZoom
    }),
    math({
        locale: zhHansMath
    }),
    mermaid({
        locale: zhHansMerimaid
    }),
    markdownTheme({
        locale: zhHansMarkdownTheme,
        themes,
        defaultTheme: 'juejin'
    }),
    highlightTheme({
        locale: zhHansHighlightTheme,
        highlights,
        defaultHighlight: useSettingStore().codeTheme
    }),
    enhancePlugin(),
    imageUploadPlugin(),
    customImagePlugin(),
    pasteImagePlugin()
]

export default defineComponent({
    name: 'markdown-editor',
    components: {
        // @ts-ignore
        Editor: Editor
    },
    props: {
        modelValue: String
    },
    emits: ['update:modelValue'],
    data: () => ({
        value: '',
        plugins: markRaw(plugins),
        zhHans
    }),
    watch: {
        modelValue(newValue) {
            this.value = newValue;
        },
        value(newValue) {
            this.$emit('update:modelValue', newValue);
        }
    },
    methods: {
        handleChange(v: string) {
            this.value = v
        },
    },
});
</script>
<style scoped>

</style>
