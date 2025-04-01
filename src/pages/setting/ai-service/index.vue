<template>
  <page-layout title="ai服务" class="setting-ai-service">
    <template #extra>
      <div>
        <span>推荐使用</span>
        <t-link @click="toApi()" theme="primary" hover="underline" class="ml-4px">V3 API</t-link>
        <span>，无需科学上网，即可使用。</span>
      </div>
    </template>
    <div class="h-full flex">
      <div class="setting-ai-service__side">
        <ai-service-side v-model="currentId"/>
      </div>
      <div class="setting-ai-service__content">
        <ai-service-content :current-id="currentId" @save="handleSave"/>
      </div>
    </div>
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
.setting-ai-service {
  position: relative;

  .setting-ai-service__side {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
    border-right: 1px solid var(--td-border-level-1-color);
  }

  .setting-ai-service__content {
    position: absolute;
    top: 0;
    left: 201px;
    right: 0;
    bottom: 0;
  }
}
</style>
