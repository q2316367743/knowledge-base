<template>
    <div class="app">
        <a-spin :loading="loading" :tip="loadingText" class="rain-loading">
            <a-layout class="app-layout">
                <a-layout-sider collapsed style="z-index: 50">
                    <app-side/>
                </a-layout-sider>
                <a-layout-content>
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
        <update-check/>
        <privacy/>
    </div>
</template>
<script lang="ts" setup>
import {computed, defineAsyncComponent, ref} from "vue";
import {keyword, useDbKeyRefreshEvent, usePageJumpEvent} from "@/global/BeanFactory";
// 存储
import {useGlobalStore} from "@/store/GlobalStore";
import {useArticleStore} from "@/store/db/ArticleStore";
// 组件
import {ArticleIndex} from "@/entity/article";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useTodoStore} from "@/store/components/TodoStore";
import {htmlToArticle} from "@/components/export-component/htmlToArticle";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {access} from "@/plugin/Statistics";


const UpdateCheck = defineAsyncComponent(() => import("@/components/update-check/index.vue"));
const privacy = defineAsyncComponent(() => import("@/components/update-check/privacy.vue"));
const AppSide = defineAsyncComponent(() => import("@/components/app-side/index.vue"))

const router = useRouter();

const preview = ref({
    visible: false,
    src: ''
})

const loading = computed(() => useGlobalStore().loading);
const loadingText = computed(() => useGlobalStore().loadingText);


// 插件进入
utools.onPluginEnter(action => {
    const code = action.code as string;
    const items = code.split(":");
    if (items.length == 2) {
        onPluginEnter(items[0], items[1], action.payload)
    }
});
// 主题
useGlobalStore().initDarkColors();

useHomeEditorStore().init();
useChatSettingStore().init();

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
    console.log(title);
    title = decodeURIComponent(title);
    console.log(title);
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

//前往文章
function toArticle(id?: string) {
    if (!id) {
        return;
    }
    useHomeEditorStore().openArticle(parseInt(id || '0'));
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
        access("feature", "查看文章");
        toArticle(preload);
    } else if (operate === 'todo') {
        access("feature", "查看待办");
        toTodo(preload);
    } else if (operate === 'function') {
        if (preload === 'import') {
            access("feature", "导入文章");
            useGlobalStore().startLoading("开始导入")
            htmlToArticle(extra)
                .then(() => MessageUtil.success("导入成功"))
                .catch(e => MessageUtil.error("导入失败", e))
                .finally(() => useGlobalStore().closeLoading());
        } else if (preload === 'editor') {
            access("feature", "前往编辑器");
            router.push('/home');
        } else if (preload === 'todo') {
            access("feature", "前往待办");
            router.push('/todo');
        } else if (preload === 'add') {
            access("feature", "新增文章");
            useArticleStore().addSimple(extra)
                .then(id => useHomeEditorStore().openArticle(id));
        }
    } else if (operate === 'window') {
        utools.createBrowserWindow(`dist/${preload}.html`, {
            width: 1200,
            height: 800
        }, () => {
            utools.hideMainWindow();
            utools.outPlugin()
        })
    }
}

window.preload.ipcRenderer.receiveMessage('db', message => {
    useDbKeyRefreshEvent.emit(message);
})

</script>
<style lang="less">
</style>
