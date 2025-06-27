<template>
  <div class="app">
    <app-bg-image />
    <div class="app-layout" :class="{collapsed: appCollapsed}">
      <div class="app-aside">
        <app-side/>
      </div>
      <div class="app-content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['home', 'note', 'todo', 'news']">
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </div>
    </div>
    <t-image-viewer v-model:visible="preview.visible" :images="[preview.src]"/>
    <update-check/>
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
  </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {createServer} from "@/plugin/server";
import {usePageJumpEvent} from "@/global/BeanFactory";
// 存储
import {appCollapsed, useGlobalStore} from "@/store";
// 组件
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useMainPushCallback, useMainPushSelectCallback, usePluginEnter} from "@/hooks/UToolsEvent";
import AppSide from "@/components/app-side/index.vue";
import {useThemeSettingStore} from "@/store/setting/ThemeSettingStore";
import AppBgImage from "@/modules/AppLayout/AppBgImage.vue";


const UpdateCheck = defineAsyncComponent(() => import("@/components/update-check/index.vue"));

const router = useRouter();

const preview = ref({
  visible: false,
  src: ''
})

const themeColor = computed(() => useGlobalStore().themeColor);

// 主题
useGlobalStore().initDarkColors();
useThemeSettingStore().init();


usePageJumpEvent.reset();
usePageJumpEvent.on(path => router.push(path));

// @ts-ignore 全局事件
window.onImagePreview = (src: string) => {
  preview.value = {
    visible: true,
    src
  }
}
// @ts-ignore 全局事件
window.jumpToArticle = (title: string) => {
  title = decodeURIComponent(title);
  toArticleByRelation(title)
}


// 插件进入
InjectionUtil.event.onPluginEnter(action => {
  const code = action.code as string;
  const items = code.split(":");
  if (items.length == 2) {
    usePluginEnter(items[0], items[1], action.payload)
  }
});
// 适配新版，快速启动，推送数据到主程序
InjectionUtil.event.onMainPush(useMainPushCallback, useMainPushSelectCallback);

// 启动http
createServer();


</script>
<style lang="less" scoped>
.app-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;

  &.collapsed {
    .app-aside {
      width: 64px;
    }

    .app-content {
      left: 65px;
    }
  }

  .app-aside {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 232px;
    z-index: 1;
    overflow: hidden;
    border-right: 1px solid var(--td-border-level-2-color);
    transition: width 0.3s;
  }

  .app-content {
    position: absolute;
    top: 0;
    left: 233px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    transform: translate(0, 0);
    transition: left 0.3s;
  }
}
</style>
