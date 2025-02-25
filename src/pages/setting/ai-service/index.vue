<template>
  <page-layout title="ai服务">
    <template #extra>
      <a-tag color="orange" bordered>
        <span>推荐使用</span>
        <a-link @click="toApi()">V3 API</a-link>
        <span>，无需科学上网，即可使用。</span>
      </a-tag>
    </template>
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
const toApi = () => utools.shellOpenExternal("https://api.v3.cm/register?aff=6A4f");
</script>
<style scoped lang="less">

</style>
