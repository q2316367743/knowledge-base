<template>
    <a-layout class="home-editor">
        <a-layout-sider :collapsed="collapsed" :collapsed-width="0" :width="264">
            <editor-side />
        </a-layout-sider>
        <a-layout-content>
            <editor-content />
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import EditorSide from '@/pages/home/home-editor/editor-side.vue';
import EditorContent from "@/pages/home/home-editor/editor-content.vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";


const collapsed = computed(() => useHomeEditorStore().collapsed);
</script>
<style scoped>

</style>
