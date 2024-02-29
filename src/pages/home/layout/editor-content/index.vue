<template>
    <div class="he-editor">
        <editor-content-header />
        <editor-content-container />
    </div>
</template>
<script lang="ts" setup>
import EditorContentHeader from "@/pages/home/layout/editor-content/components/EditorContentHeader.vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/components/EditorContentContainer.vue";
</script>
<style lang="less">
@import "./index.less";
</style>
