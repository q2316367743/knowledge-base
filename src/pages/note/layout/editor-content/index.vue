<template>
  <a-layout class="he-editor">
    <a-layout-header>
      <editor-content-header/>
    </a-layout-header>
    <a-layout-content>
      <editor-content-container v-for="article in homeEditorArticles" :key="article.id" :article-index="article"
                                v-show="article.id === homeEditorId"/>
      <not-note status="404" v-if="homeEditorArticles.length === 0"/>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import {homeEditorArticles, homeEditorId} from "@/store/components/HomeEditorStore";
import EditorContentHeader from "@/pages/note/layout/editor-content/layout/EditorContentHeader/index.vue";
import EditorContentContainer from "@/pages/note/layout/editor-content/layout/EditorContentContainer/index.vue";
import NotNote from "@/pages/note/components/NotNote.vue";


</script>
<style lang="less">
@import "./index.less";
</style>
