<template>
    <div class="editor-content">
        <he-preview v-if="preview"/>
        <he-editor :id="id" v-else/>
    </div>
</template>
<script lang="ts" setup>

import {computed, ref, watch} from "vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import HeEditor from "@/pages/home/home-editor/components/he-editor.vue";
import HePreview from "@/pages/home/home-editor/components/he-preview.vue";

const id = computed(() => useHomeEditorStore().id);
const preview = ref(false);

watch(() => useHomeEditorStore().id, value => init(value));

async function init(articleId: number) {
    const articleIndex = useArticleStore().articleMap.get(articleId);
    if (!articleIndex) {
        MessageUtil.error(`文章【${articleId}】未找到，请刷新后重试！`);
        return;
    }
    // 此处判断是锁定还是编辑器
    preview.value = typeof articleIndex.preview == 'undefined' ? false : articleIndex.preview;
}
</script>
<style scoped>
.editor-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
