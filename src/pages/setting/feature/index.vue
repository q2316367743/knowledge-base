<template>
    <div class="feature">
        <a-divider>新增文章</a-divider>
        <feature-add-article />
        <a-divider>markdown文章导入</a-divider>
        <feature-markdown-import />
        <a-divider>新增动态</a-divider>
        <feature-add-zone />
    </div>
</template>
<script lang="ts" setup>
import FeatureAddArticle from "@/pages/setting/feature/components/feature-add-article.vue";
import FeatureMarkdownImport from "@/pages/setting/feature/components/feature-markdown-import.vue";
import FeatureAddZone from "@/pages/setting/feature/components/feature-add-zone.vue";
</script>
<style scoped>
.feature {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;
    overflow: auto;
}
</style>
