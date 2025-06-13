<template>
  <t-layout class="setting">
    <t-aside v-if="max">
      <t-menu v-model="activeKey" @change="handleClick">
        <t-menu-item value="/setting/base">基础设置</t-menu-item>
        <t-menu-item value="/setting/module">模块设置</t-menu-item>
        <t-menu-item value="/setting/code-editor">代码笔记设置</t-menu-item>
        <t-menu-item value="/setting/theme">主题设置</t-menu-item>
        <t-menu-item value="/setting/code-run" v-if="isUtools">代码运行设置</t-menu-item>
        <t-menu-item value="/setting/ai-service">AI 服务设置</t-menu-item>
        <t-menu-item value="/setting/ai-assistant">AI 助手设置</t-menu-item>
      </t-menu>
    </t-aside>
    <t-header v-else>
      <t-tabs v-model="activeKey" @change="handleClick">
        <t-tab-panel value="/setting/base" label="基础设置"/>
        <t-tab-panel value="/setting/module" label="模块设置"/>
        <t-tab-panel value="/setting/code-editor" label="代码笔记设置"/>
        <t-tab-panel value="/setting/theme" label="主题设置"/>
        <t-tab-panel value="/setting/code-run" label="代码运行设置" v-if="isUtools"/>
        <t-tab-panel value="/setting/ai-service" label="AI 服务设置"/>
        <t-tab-panel value="/setting/ai-assistant" label="AI 助手设置"/>
      </t-tabs>
    </t-header>
    <t-content class="main">
      <div class="setting-content">
        <router-view/>
      </div>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

const route = useRoute();
const router = useRouter();
const size = useWindowSize();

const isUtools = InjectionUtil.env.isUtools();

const activeKey = ref(route.path);
const max = computed(() => size.width.value > 960);

const handleClick = (v: any) => {
  router.push(v);
};
</script>
<style scoped lang="less">
.setting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .main {
    width: calc(100% - 32px);
    height: calc(100% - 48px);
    padding: 24px 16px;
    overflow-y: auto;
    position: relative;
    background-color: var(--td-bg-color-container);

    .setting-content {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
