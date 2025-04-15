<template>
  <div class="app">
    <t-loading :loading="loading" :text="loadingText" class="w-full h-full">
      <div class="app-layout">
        <div class="app-aside">
          <app-side/>
        </div>
        <div class="app-content">
          <router-view/>
        </div>
      </div>
    </t-loading>
    <t-image-viewer v-model:visible="preview.visible" :images="[preview.src]"/>
    <update-check/>
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
  </div>
</template>
<script lang="ts" setup>
import {useRouter} from "vue-router";
import {useUmami} from "@/plugin/umami";
import {createServer} from "@/plugin/server";
import {keyword, usePageJumpEvent} from "@/global/BeanFactory";
// 存储
import {themeColor, useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
// 组件
import {ArticleIndex} from "@/entity/article";
import {toArticleByRelation} from "@/components/ArticePreview/OpenArticle";
import {addSimpleNote} from "@/utils/component/AddNoteUtil";
import AppSide from "@/components/app-side/index.vue";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";


const UpdateCheck = defineAsyncComponent(() => import("@/components/update-check/index.vue"));

const router = useRouter();

const preview = ref({
  visible: false,
  src: ''
})

const loading = computed(() => useGlobalStore().loading);
const loadingText = computed(() => useGlobalStore().loadingText);

// 插件进入
InjectionUtil.event.onPluginEnter(action => {
  const code = action.code as string;
  const items = code.split(":");
  if (items.length == 2) {
    onPluginEnter(items[0], items[1], action.payload)
  }
});
// 主题
useGlobalStore().initDarkColors();


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

// 适配新版，快速启动，推送数据到主程序
InjectionUtil.event.onMainPush(action => {
  useGlobalStore().initDarkColors();
  if (action.code !== "function:search") {
    return [];
  }
  // 快速启动
  const storages = new Array<ArticleIndex>();
  for (let storage of useArticleStore().articles) {
    if (storage.name.indexOf(action.payload) > -1) {
      storages.push(storage);
    }
  }
  const items = storages.slice(0, Math.min(5, storages.length)).map(e => ({
    icon: 'public/logo.png',
    text: e.name,
    title: e.id + ''
  }))
  if (storages.length > 6) {
    items.push({
      icon: 'public/logo.png',
      text: `更多${storages.length - 5}条记录请前往插件内搜索`,
      title: ''
    })
  } else if (storages.length === 6) {
    items.push({
      icon: 'public/logo.png',
      text: storages[5]['name'],
      title: storages[5]['id'] + ''
    })
  }
  return items;
}, action => {
  keyword.value = `${action.payload}`;
  if (action.option.title) {
    toArticle(action.option.title);
  }
});

//前往笔记
function toArticle(id?: string) {
  if (!id) {
    return;
  }
  useHomeEditorStore().openArticle(parseInt(id || '0'));
  router.push('/note');
}

// 前往待办
function toTodo(id?: string) {
  const categoryId = parseInt(id || '0');
  useTodoWrapStore().init(categoryId);
  useTodoWrapStore().setItemId(categoryId);
  router.push('/todo');
}

// 插件进入
function onPluginEnter(operate: string, preload: string, extra: string) {
  if (operate === 'article') {
    useUmami.track("feature", "查看笔记");
    toArticle(preload);
  } else if (operate === 'todo') {
    useUmami.track("feature", "查看待办");
    toTodo(preload);
  } else if (operate === 'function') {
    if (preload === 'editor') {
      useUmami.track("feature", "前往编辑器");
      router.push('/note');
    } else if (preload === 'todo') {
      useUmami.track("feature", "前往待办");
      router.push('/todo');
    } else if (preload === 'add') {
      useUmami.track("feature", "新增笔记");
      addSimpleNote(extra).then((a) => useHomeEditorStore().openArticle(a));
    }
  }
}

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

  .app-aside {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 48px;
    z-index: 50;
    overflow: hidden;
    border-right: 1px solid var(--td-border-level-2-color);
  }

  .app-content {
    position: absolute;
    top: 0;
    left: 49px;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
}
</style>
