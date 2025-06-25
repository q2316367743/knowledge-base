<template>
  <page-layout title="更新日志">
    <template #extra>
      <span>反馈建议前往</span>
      <t-link @click="toFeedback()" theme="primary">反馈中心</t-link>
      <span>，支持图片反馈。</span>
    </template>
    <loading-result v-if="loading" title="正在获取更新日志"/>
    <markdown v-else v-model="md" preview/>
    <t-back-top container=".page-container"/>
  </page-layout>
</template>
<script lang="ts" setup>
import {toFeedback} from "@/global/Constant";
import axios from "axios";
import MessageUtil from "@/utils/modal/MessageUtil";
import Markdown from "@/editor/MarkdownEditor/index.vue";

const md = ref('');
const loading = ref(true);

onMounted(() => {
  axios.get('./example/changelog.md', {
    responseType: 'text'
  }).then((res) => {
    loading.value = false;
    md.value = res.data;
  }).catch((err) => {
    MessageUtil.error("获取更新日志失败", err);
  });
})
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
