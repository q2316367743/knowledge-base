<template>
    <div class="editor-content">
        <he-preview v-if="preview" :id="id + ''"/>
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
import {getDefaultArticleIndex} from "@/entity/article";
import {useUpdatePreviewEvent} from "@/global/BeanFactory";

const id = computed(() => useHomeEditorStore().id);
const articleIndex = ref(getDefaultArticleIndex());
const title = ref("");
const preview = computed(() => typeof articleIndex.value.preview == 'undefined' ? false : articleIndex.value.preview);

watch(() => useHomeEditorStore().id, value => init(value));

useUpdatePreviewEvent.reset();
useUpdatePreviewEvent.on(articleId => {
    if (articleId === id.value) {
        init(articleId)
    }
})

function init(articleId: number) {
    const article = useArticleStore().articleMap.get(articleId);
    if (!article) {
        MessageUtil.error(`文章【${articleId}】未找到，请刷新后重试！`);
        return;
    }
    articleIndex.value = article;
    // 此处判断是锁定还是编辑器
    title.value = article.name;
}

</script>
<style lang="less">
.editor-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
