<template>
    <a-layout class="app kb-preview">
        <router-view />
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
    </a-layout>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useFolderStore} from "@/store/db/FolderStore";
import {computed, nextTick, ref} from "vue";
import DrauuEditor from "@/pages/home/layout/editor-content/editor/DrauuEditor/index.vue";
import {_addArticle} from "@/pages/home/components/he-context";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import MessageUtil from "@/utils/modal/MessageUtil";

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
