<template>
  <div class="h-32px p-2px">
    <editor-content-extra-run v-if="isUtools"/>
    <editor-content-extra-ai v-if="isUtools || isTauri"/>
    <editor-content-extra-preview/>
    <editor-content-extra-more/>
  </div>
</template>
<script lang="ts" setup>
import EditorContentExtraAi
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraAi.vue";
import EditorContentExtraRun
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraRun.vue";
import EditorContentExtraPreview
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraPreview.vue";
import EditorContentExtraMore
  from "@/pages/note/layout/editor-content/layout/EditorContentHeader/EditorContentExtraMore.vue";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const isUtools = InjectionUtil.env.isUtools();
const isTauri = InjectionUtil.env.isTauri();
</script>
<style scoped lang="less">
</style>
