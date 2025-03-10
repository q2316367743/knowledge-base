<template>
  <t-layout class="news-list w-full h-full">
    <news-list-side />
    <news-list-content />
  </t-layout>
</template>
<script lang="ts" setup>
import NewsListSide from "@/pages/news/list/components/NewsListSide.vue";
import NewsListContent from "@/pages/news/list/components/NewsListContent.vue";
</script>
<style scoped lang="less">
</style>
