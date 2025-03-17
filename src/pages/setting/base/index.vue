<template>
  <div class="setting">
    <t-tabs v-model="activeKey">
      <t-tab-panel value="base" label="基础设置"/>
      <t-tab-panel value="module" label="模块设置"/>
      <t-tab-panel value="code-editor" label="代码笔记设置"/>
      <t-tab-panel value="theme" label="主题设置"/>
      <t-tab-panel value="chat" label="AI设置"/>
    </t-tabs>
    <main class="main">
      <base-setting v-if="activeKey === 'base'"/>
      <module-setting v-else-if="activeKey === 'module'"/>
      <code-editor-setting v-else-if="activeKey === 'code-editor'"/>
      <theme-setting v-else-if="activeKey === 'theme'"/>
      <chat-setting v-else-if="activeKey === 'chat'"/>
    </main>
  </div>
</template>
<script lang="ts" setup>
import BaseSetting from "@/pages/setting/base/components/BaseSetting.vue";
import CodeEditorSetting from "@/pages/setting/base/components/CodeEditorSetting.vue";
import ThemeSetting from "@/pages/setting/base/components/ThemeSetting.vue";
import ChatSetting from "@/pages/setting/base/components/ChatSetting.vue";
import ModuleSetting from "@/pages/setting/base/components/ModuleSetting.vue";

const route = useRoute();

const activeKey = ref<string>((route.query.tab as string) || 'base');
</script>
<style scoped lang="less">
.setting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .main {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 8px;
  }
}
</style>
