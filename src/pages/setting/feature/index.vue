<template>
  <div class="feature">
    <t-divider>新增笔记</t-divider>
    <feature-add-article/>
    <t-divider>markdown笔记导入</t-divider>
    <feature-markdown-import/>
  </div>
</template>
<script lang="ts" setup>
import FeatureAddArticle from "@/pages/setting/feature/components/feature-add-article.vue";
import FeatureMarkdownImport from "@/pages/setting/feature/components/feature-markdown-import.vue";
</script>
<style scoped>
</style>
