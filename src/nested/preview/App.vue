<template>
    <a-layout class="app kb-preview">
        <home/>
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
    </a-layout>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import Home from '@/nested/preview/pages/home/index.vue';
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";

useGlobalStore().initDarkColors();
useArticleStore().init();
useFolderStore().init();

const preview = ref({
    visible: false,
    src: ''
})

// @ts-ignore 全局事件
window.onImagePreview = (src: string) => {
    preview.value = {
        visible: true,
        src
    }
}

// @ts-ignore 全局事件
window.jumpToArticle = (title: string) => {
    title = decodeURIComponent(title);
    toArticleByRelation(title)
}


</script>
<style scoped lang="less">
.kb-preview {
    background-color: var(--color-bg-1);
}
</style>
