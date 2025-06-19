<template>
  <page-layout title="更新日志">
    <template #extra>
      <span>反馈建议前往</span>
      <t-link @click="toFeedback()" theme="primary">反馈中心</t-link>
      <span>，支持图片反馈。</span>
    </template>
    <div class="p-8px">
      <t-timeline style="margin-top: 10px;" label-position="relative">
        <t-timeline-item :label="log.time" placement="top" v-for="log in UpdateLog">
          <div class="update-log-card" :title="log.version">
            <div class="flex justify-between items-center px-16px pt-12px pb-8px">
              <div style="font-size: var(--td-font-size-title-large);font-weight: bold">{{ log.version }}</div>
              <t-link v-if="log.url" theme="primary">详细链接</t-link>
            </div>
            <update-item :log="log as Log"/>
          </div>
        </t-timeline-item>
      </t-timeline>
    </div>
    <t-back-top container=".page-container"/>
  </page-layout>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog.json";
import {toFeedback} from "@/global/Constant";
import {Log} from "@/components/update-check/domain";
</script>
<style scoped lang="less">
.update-log-card {
  border: 1px solid var(--td-border-level-2-color);
  background-color: var(--kb-bg-color-3);
  border-radius: var(--td-radius-default);
  padding: 8px;
  transition: all 0.3s ease-in-out;

  &:hover {
    box-shadow: var(--td-shadow-3);
  }
}
</style>
