<template>
    <div class="preview-info">
        <a-page-header :title="articleIndex ? articleIndex.name : '文章'" @back="onBack" />
        <div class="container">
            <editor-content-container :article-index="articleIndex" v-if="articleIndex" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ArticleIndex} from "@/entity/article";
import EditorContentContainer from "@/pages/home/layout/editor-content/layout/EditorContentContainer/EditorContentEditor.vue";

const route = useRoute();
const router = useRouter();

const articleIndex = ref<ArticleIndex>()

function onBack() {
    router.push('/');
}

// 获取文章
const id = route.params.id as string;

function init(id: string) {
    const res = useArticleStore().articleMap.get(parseInt(id));
    if (!res) {
        MessageUtil.error(`未找到文章：${id}`);
        onBack();
        return;
    }
    articleIndex.value = {
        ...res,
        preview: true
    };
}

init(id);

</script>
<style scoped lang="less">
.preview-info {
    position: relative;
    height: 100%;
    width: 100%;
    .container {
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
}
</style>
