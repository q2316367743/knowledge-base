<template>
    <a-layout class="app kb-preview">
        <router-view/>
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
    </a-layout>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {ref} from "vue";

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

</script>
<style scoped lang="less">
.kb-preview {
    background-color: transparent;
}
</style>
