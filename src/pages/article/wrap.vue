<template>
    <div class="article-wrap">
        <kb-article :id="route.query.id as string"/>
    </div>
</template>
<script lang="ts" setup>
import {useRoute} from "vue-router";
import KbArticle from '@/pages/article/index.vue';

const route = useRoute();
</script>
<style scoped>
.article-wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--color-text-1);
    background-color: var(--color-bg-1);
    z-index: 51;
}
</style>
