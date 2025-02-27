<template>
  <page-layout title="ai服务">
    <template #extra>
      <t-tag color="orange" variant="outline">
        <span>推荐使用</span>
        <t-link @click="toApi()" hover="color">V3 API</t-link>
        <span>，无需科学上网，即可使用。</span>
      </t-tag>
    </template>
    <t-layout class="h-full">
      <t-aside style="border-right: 1px solid var(--td-border-level-1-color)">
        <ai-service-side v-model="currentId"/>
      </t-aside>
      <t-content style="background-color: var(--td-bg-color-container)">
        <ai-service-content :current-id="currentId" @save="handleSave"/>
      </t-content>
    </t-layout>
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
