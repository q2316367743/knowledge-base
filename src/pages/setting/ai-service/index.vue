<template>
  <page-layout title="ai服务">
    <a-layout class="h-full">
      <a-layout-sider>
        <ai-service-side v-model="currentId"/>
      </a-layout-sider>
      <a-layout-content>
        <ai-service-content :current-id="currentId" @save="handleSave"/>
      </a-layout-content>
    </a-layout>
  </page-layout>
</template>
<script lang="ts" setup>
import AiServiceSide from "@/pages/setting/ai-service/components/AiServiceSide.vue";
import AiServiceContent from "@/pages/setting/ai-service/components/AiServiceContent.vue";

const currentId = ref('');

function handleSave(id: string) {
  currentId.value = id;
}
</script>
<style scoped lang="less">

</style>
