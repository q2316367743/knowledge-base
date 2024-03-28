<template>
    <div class="setting">
        <a-tabs v-model:active-key="activeKey" hide-content>
            <a-tab-pane key="base" title="基础设置"/>
            <a-tab-pane key="image" title="图床设置" disabled/>
            <a-tab-pane key="theme" title="主题设置"/>
            <a-tab-pane key="chat" title="聊天设置"/>
        </a-tabs>
        <main class="main">
            <base-setting v-if="activeKey === 'base'"/>
            <image-setting v-else-if="activeKey === 'image'" />
            <theme-setting v-else-if="activeKey === 'theme'"/>
            <chat-setting v-else-if="activeKey === 'chat'"/>
        </main>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";

import BaseSetting from "@/pages/setting/base/components/BaseSetting.vue";
import ThemeSetting from "@/pages/setting/base/components/ThemeSetting.vue";
import ChatSetting from "@/pages/setting/base/components/ChatSetting.vue";
import ImageSetting from "@/pages/setting/base/components/ImageSetting.vue";

const activeKey = ref<string>('base');
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
    }
}
</style>
