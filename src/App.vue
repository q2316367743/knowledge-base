<template>
    <link :href="`./highlight.js/styles/${codeTheme}.css`" type="text/css" rel="stylesheet">
    <div class="app">
        <a-spin :loading="loading" :tip="loadingText" class="rain-loading">
            <a-layout>
                <a-layout-sider collapsed style="z-index: 50">
                    <a-menu style="width: 200px;height: 100%;" breakpoint="xl" v-model:selected-keys="selectedKeys">
                        <a-menu-item key="/home">
                            <template #icon>
                                <icon-home/>
                            </template>
                            主页
                        </a-menu-item>
                        <a-menu-item key="/zone">
                            <template #icon>
                                <icon-qq-zone />
                            </template>
                            空间
                        </a-menu-item>
                        <a-menu-item key="/timeline">
                            <template #icon>
                                <icon-time-line/>
                            </template>
                            时间线
                        </a-menu-item>
                        <a-menu-item key="/graph">
                            <template #icon>
                                <icon-mind-mapping/>
                            </template>
                            图
                        </a-menu-item>
                        <a-sub-menu key="/more">
                            <template #icon>
                                <icon-more/>
                            </template>
                            <template #title>更多</template>
                            <a-menu-item key="/more/setting/base">
                                基础设置
                            </a-menu-item>
                            <a-menu-item key="/more/setting/category">
                                分类设置
                            </a-menu-item>
                            <a-menu-item key="/more/recommend">
                                <template #icon>
                                    <icon-thumb-up/>
                                </template>
                                推荐
                            </a-menu-item>
                            <a-menu-item key="/more/about">
                                <template #icon>
                                    <icon-exclamation-circle/>
                                </template>
                                关于
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <sub-input/>
        <markdown-import />
        <a-image-preview v-model:visible="preview.visible" :src="preview.src"/>
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineComponent} from "vue";
import {statistics, useImportEvent} from "@/global/BeanFactory";
// 存储
import {useZoneStore} from "@/store/db/ZoneStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {useSettingStore} from "@/store/db/SettingStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
// 组件
import IconTimeLine from "@/icon/IconTimeLine.vue";
import SubInput from '@/components/SubInput/index.vue';
import MarkdownImport from '@/components/MarkdownImport/index.vue';

export default defineComponent({
    name: 'app',
    components: {IconTimeLine, SubInput, MarkdownImport},
    data: () => ({
        selectedKeys: ['/dashboard'],
        preview: {
            visible: false,
            src: ''
        }
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'loading', 'loadingText']),
        ...mapState(useSettingStore, ['codeTheme']),
    },
    watch: {
        '$route': {
            handler(newValue) {
                const path = newValue.path as string;
                const name = newValue.name as string;
                if (path !== this.selectedKeys[0]) {
                    this.selectedKeys[0] = path;
                }
                statistics.access(name);
            }
        },
        selectedKeys(newValue) {
            this.$router.push(newValue[0]);
        }
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
        this.theme();
        this.selectedKeys = [this.$route.path];
        // 初始化数据
        this.init();
        // 全局事件
        window.onImagePreview = (src) => {
            this.preview = {
                visible: true,
                src
            }
        }
    },
    methods: {
        theme() {
            if (this.isDark) {
                // 设置为暗黑主题
                document.body.setAttribute('arco-theme', 'dark');
            } else {
                // 恢复亮色主题
                document.body.removeAttribute('arco-theme');
            }
        },
        init() {
            useZoneStore().init();
            useSettingStore().init();
            useArticleStore().init();
            useCategoryStore().init();
        },
        onPluginEnter(operate: string, preload: string, extra: string) {
            if (operate === 'article') {
                this.$router.push('/article/' + preload);
            }else if (operate === 'function') {
                if (preload === 'import') {
                    useImportEvent.emit(extra);
                }else if (preload === 'application') {
                    this.$router.push('/home');
                }else if (preload === 'add') {
                    sessionStorage.setItem("extra", extra);
                    this.$router.push('/editor/0')
                }
            }
        }
    }
});
</script>
<style lang="less"></style>
