<template>
    <link :href="`./highlight.js/styles/${codeTheme}.css`" type="text/css" rel="stylesheet">
    <div class="app">
        <a-spin :loading="loading" :tip="loadingText" class="rain-loading">
            <a-layout>
                <a-layout-sider collapsed style="z-index: 50">
                    <app-side/>
                </a-layout-sider>
                <a-layout-content>
                    <router-view v-if="show"/>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <markdown-import/>
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
        <update-item />
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineAsyncComponent, defineComponent,} from "vue";
import {useImportEvent} from "@/global/BeanFactory";
// 存储
import {useZoneStore} from "@/store/db/ZoneStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";
// 组件
import MarkdownImport from '@/components/MarkdownImport/index.vue';
import {ArticleIndex} from "@/entity/article";
import MessageUtil from "@/utils/MessageUtil";

export default defineComponent({
    name: 'app',
    components: {
        UpdateItem: defineAsyncComponent(() => import("@/components/update-check/index.vue")),
        MarkdownImport,
        AppSide: defineAsyncComponent(() => import("@/components/app-side/index.vue"))
    },
    data: () => ({
        preview: {
            visible: false,
            src: ''
        },
        show: true
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'loading', 'loadingText']),
        ...mapState(useBaseSettingStore, ['codeTheme']),
    },
    created() {
        // 插件进入
        utools.onPluginEnter(action => {
            const code = action.code as string;
            const items = code.split(":");
            if (items.length == 2) {
                this.onPluginEnter(items[0], items[1], action.payload)
            }
        })
        // 主题
        useGlobalStore().initDarkColors();
        // 初始化数据
        import('@/global/BeanFactory').then(data => {
            useGlobalStore().startLoading("开始初始化数据...");
            data.initData()
                .then(() => console.log("数据初始化成功"))
                .catch(e => MessageUtil.error("数据初始化失败",e))
                .finally(() => useGlobalStore().closeLoading());


        })
        // 全局事件
        window.onImagePreview = (src) => {
            this.preview = {
                visible: true,
                src
            }
        }
        // 适配新版，快速启动
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
        }, action => {
            if (this.$route.path.startsWith("/article")) {
                this.show = false;
            }
            this.$router.push('/article/' + action.option.title).finally(() => this.show = true);
            return true;
        });
    },
    methods: {
        onPluginEnter(operate: string, preload: string, extra: string) {
            if (operate === 'article') {
                this.$router.push('/article/' + preload);
            } else if (operate === 'function') {
                if (preload === 'import') {
                    useImportEvent.emit(extra);
                } else if (preload === 'editor') {
                    this.$router.push('/home');
                } else if (preload === 'todo') {
                    this.$router.push('/todo');
                } else if (preload === 'add') {
                    sessionStorage.setItem("extra", extra);
                    this.$router.push('/editor/0')
                } else if (preload === 'add-zone') {
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
    }
});
</script>
<style lang="less"></style>
