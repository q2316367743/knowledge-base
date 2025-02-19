<template>
  <page-layout title="AI 助手">
    <template #extra>
      <a-button type="primary" @click="addAiAssistant">
        新增
      </a-button>
    </template>
    <a-list :bordered="false" hoverable>
      <a-list-item v-for="a in assistants" :key="a.id">
        <a-list-item-meta :title="a.name" :description="a.system"/>
      </a-list-item>
    </a-list>
  </page-layout>
</template>
<script lang="ts" setup>
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {addAiAssistant} from "@/pages/setting/ai-assistant/modal";

const assistants = computed(() => useAiAssistantStore().aiAssistants);
</script>
<style scoped lang="less">

</style>
