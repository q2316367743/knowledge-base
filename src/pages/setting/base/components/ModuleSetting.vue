<template>
  <div class="module-setting">
    <t-alert>功能模块设置</t-alert>
    <t-paragraph>
      <t-checkbox v-model="moduleForAi">是否启用AI主页</t-checkbox>
    </t-paragraph>
    <t-paragraph>
      <t-checkbox v-model="moduleForNews" :disabled="disabledForModule">是否启用资讯模块（Beta版）</t-checkbox>
      <div class="t-input__help" v-if="disabledForModule">请将uTools升级到7.0.0以上版本</div>
    </t-paragraph>
  </div>
</template>
<script lang="ts" setup>
import {moduleForAi, moduleForNews} from "@/store/ModuleStore";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const disabledForModule = !InjectionUtil.version.isSupportMarkdown();
</script>
<style scoped lang="less">

</style>
