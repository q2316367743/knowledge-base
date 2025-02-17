<template>
  <a-layout class="he-editor">
    <a-layout-header>
      <editor-content-header/>
    </a-layout-header>
    <a-layout-content>
      <editor-content-container v-for="article in homeEditorArticles" :key="article.id" :article-index="article"
                                v-show="article.id === homeEditorId"/>
      <a-result title="请在左侧选择文章" subtitle="点击加号创建文章" status="404" v-if="homeEditorArticles.length === 0"
                style="margin-top: 20vh"/>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import {homeEditorArticles, homeEditorId} from "@/store/components/HomeEditorStore";
import EditorContentHeader from "@/pages/note/layout/editor-content/layout/EditorContentHeader/index.vue";
import EditorContentContainer from "@/pages/note/layout/editor-content/layout/EditorContentContainer/index.vue";


</script>
<style lang="less">
@import "./index.less";
</style>
