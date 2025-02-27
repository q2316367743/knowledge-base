<template>
  <page-layout title="更新日志">
    <template #extra>
      <span>反馈建议前往</span>
      <t-link @click="toTxc()" theme="primary">反馈中心</t-link>
      <span>，支持图片反馈。</span>
    </template>
    <div class="p-8px">
      <t-timeline style="margin-top: 10px;" label-position="relative">
        <t-timeline-item :label="log.time" placement="top" v-for="log in UpdateLog">
          <t-card :hover-shadow="true" :title="log.version">
            <update-item :log="log"/>
            <template #actions>
              <t-link v-if="log.url" theme="primary">详细链接</t-link>
            </template>
          </t-card>
        </t-timeline-item>
      </t-timeline>
    </div>
    <t-back-top container=".page-container"/>
  </page-layout>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog";
import Constant from "@/global/Constant";

const toTxc = () => utools.shellOpenExternal(Constant.feedback);
</script>
<style scoped>
</style>
