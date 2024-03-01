<template>
    <div class="he-editor">
        <editor-content-header/>
        <div class="ec-container">
            <editor-content-container v-for="article in indexes" :key="article.id" :article-index="article"
                                      v-show="article.id === id"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import EditorContentHeader from "@/pages/home/layout/editor-content/components/EditorContentHeader.vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/components/EditorContentContainer.vue";
import {computed} from "vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

const indexes = computed(() => useHomeEditorStore().indexes);
const id = computed(() => useHomeEditorStore().id);
</script>
<style lang="less">
@import "./index.less";
</style>
