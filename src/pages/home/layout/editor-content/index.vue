<template>
    <a-layout class="he-editor">
        <a-layout-header>
            <editor-content-header/>
        </a-layout-header>
        <a-layout-content>
            <editor-content-container v-for="article in indexes" :key="article.id" :article-index="article"
                                      v-show="article.id === id"/>
            <a-result title="请在左侧选择文章" subtitle="点击加号创建文章" status="404" v-if="indexes.length === 0"
                      style="margin-top: 20vh"/>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import EditorContentHeader from "@/pages/home/layout/editor-content/layout/EditorContentHeader/index.vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/layout/EditorContentContainer/index.vue";

const indexes = computed(() => useHomeEditorStore().indexes);
const id = computed(() => useHomeEditorStore().id);


</script>
<style lang="less">
@import "./index.less";
</style>
