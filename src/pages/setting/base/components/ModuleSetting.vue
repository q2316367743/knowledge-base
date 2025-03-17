<template>
  <div class="module-setting">
    <t-alert>功能模块设置</t-alert>
    <t-paragraph>
      <t-checkbox v-model="moduleForAi">是否启用AI主页</t-checkbox>
    </t-paragraph>
    <t-paragraph>
      <t-checkbox v-model="moduleForNews">是否启用资讯模块（Beta版）</t-checkbox>
    </t-paragraph>
  </div>
</template>
<script lang="ts" setup>
import {moduleForAi, moduleForNews} from "@/store/ModuleStore";
</script>
<style scoped lang="less">

</style>
