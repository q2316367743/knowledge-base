<template>
    <link :href="`./highlight.js/styles/${codeTheme}.css`" type="text/css" rel="stylesheet">
    <div class="app">
        <a-spin :loading="loading" :tip="loadingText" class="rain-loading">
            <a-layout>
                <a-layout-sider collapsed style="z-index: 50">
                    <app-side/>
                </a-layout-sider>
                <a-layout-content>
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <markdown-import/>
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
        <update-item/>
    </div>
</template>
<script lang="ts" setup>
import {computed, defineAsyncComponent, ref,} from "vue";
import {statistics, useImportEvent} from "@/global/BeanFactory";
// 存储
import {useZoneStore} from "@/store/db/ZoneStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";
// 组件
import MarkdownImport from '@/components/MarkdownImport/index.vue';
import {ArticleIndex} from "@/entity/article";
import MessageUtil from "@/utils/MessageUtil";
import {useRouter} from "vue-router";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useTodoStore} from "@/store/components/TodoStore";


const UpdateItem = defineAsyncComponent(() => import("@/components/update-check/index.vue"));
const AppSide = defineAsyncComponent(() => import("@/components/app-side/index.vue"))

const router = useRouter();

const preview = ref({
    visible: false,
    src: ''
})

const isDark = computed(() => useGlobalStore().isDark);
const loading = computed(() => useGlobalStore().loading);
const loadingText = computed(() => useGlobalStore().loadingText);
const codeTheme = computed(() => useBaseSettingStore().codeTheme);

// 插件进入
utools.onPluginEnter(action => {
    const code = action.code as string;
    const items = code.split(":");
    if (items.length == 2) {
        onPluginEnter(items[0], items[1], action.payload)
    }
})
// 主题
useGlobalStore().initDarkColors();
// 初始化数据
import('@/global/BeanFactory').then(data => {
    useGlobalStore().startLoading("开始初始化数据...");
    data.initData()
        .then(() => console.log("数据初始化成功"))
        .catch(e => MessageUtil.error("数据初始化失败", e))
        .finally(() => useGlobalStore().closeLoading());


})
// 全局事件
window.onImagePreview = (src) => {
    preview.value = {
        visible: true,
        src
    }
}
// 适配新版，快速启动，推送数据到主程序
utools.onMainPush(action => {
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
    return storages.map(e => ({
        icon: 'public/logo.png',
        text: e.name,
        title: e.id + ''
    }))
}, action => toArticle(action.option.title));

//前往文章
function toArticle(id?: string) {
    useHomeEditorStore().setId(parseInt(id || '0'));
    router.push('/home');
}
// 前往待办
function toTodo(id?: string) {
    const categoryId = parseInt(id || '0');
    useTodoStore().setCategoryId(categoryId);
    useTodoStore().setId(categoryId);
    router.push('/todo');
}
// 插件进入
function onPluginEnter(operate: string, preload: string, extra: string) {
    if (operate === 'article') {
        statistics.access("进入", "查看文章");
        toArticle(preload);
    } else if (operate === 'todo') {
        statistics.access("进入", "查看待办");
        toTodo(preload);
    } else if (operate === 'function') {
        if (preload === 'import') {
            statistics.access("进入", "导入文章");
            useImportEvent.emit(extra);
        } else if (preload === 'editor') {
            statistics.access("进入", "前往编辑器");
            router.push('/home');
        } else if (preload === 'todo') {
            statistics.access("进入", "前往待办");
            router.push('/todo');
        } else if (preload === 'add') {
            statistics.access("进入", "新增文章");
            useArticleStore().addSimple(extra)
                .then(id => useHomeEditorStore().setId(id));
        } else if (preload === 'add-zone') {
            statistics.access("进入", "新增动态");
            useZoneStore().addSimple(extra)
                .then(() => {
                    // 隐藏插件
                    utools.hideMainWindow();
                    utools.outPlugin();
                    // 显示提示
                    utools.showNotification("新增动态成功");
                })
                .catch(e => MessageUtil.error("新增动态失败", e));
        }
    }
}

</script>
<style lang="less"></style>
