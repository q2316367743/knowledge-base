<template>
  <div class="setting">
    <a-tabs v-model:active-key="activeKey" hide-content>
      <a-tab-pane key="base" title="基础设置"/>
      <a-tab-pane key="code-editor" title="代码笔记设置"/>
      <a-tab-pane key="theme" title="主题设置"/>
      <a-tab-pane key="chat" title="AI设置"/>
    </a-tabs>
    <main class="main">
      <base-setting v-if="activeKey === 'base'"/>
      <code-editor-setting v-else-if="activeKey === 'code-editor'"/>
      <theme-setting v-else-if="activeKey === 'theme'"/>
      <chat-setting v-else-if="activeKey === 'chat'"/>
    </main>
  </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";

import BaseSetting from "@/pages/setting/base/components/BaseSetting.vue";
import CodeEditorSetting from "@/pages/setting/base/components/CodeEditorSetting.vue";
import ThemeSetting from "@/pages/setting/base/components/ThemeSetting.vue";
import ChatSetting from "@/pages/setting/base/components/ChatSetting.vue";
import {useRoute} from "vue-router";

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
