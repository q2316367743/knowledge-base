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
                        <a-menu-item key="/random">
                            <template #icon>
                                <icon-random />
                            </template>
                            随机
                        </a-menu-item>
                        <a-menu-item key="/timeline">
                            <template #icon>
                                <icon-time-line />
                            </template>
                            时间线
                        </a-menu-item>
                        <a-menu-item key="/graph">
                            <template #icon>
                                <icon-mind-mapping />
                            </template>
                            图
                        </a-menu-item>
                        <a-menu-item key="/more/setting">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            设置
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
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <router-view/>
                </a-layout-content>
            </a-layout>
        </a-spin>
    </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {defineComponent} from "vue";

import {statistics} from "@/global/BeanFactory";

import {useGlobalStore} from "@/store/GlobalStore";
import {useSettingStore} from "@/store/db/SettingStore";
import IconRandom from "@/icon/IconRandom.vue";
import IconTimeLine from "@/icon/IconTimeLine.vue";

export default defineComponent({
    name: 'app',
    components: {IconTimeLine, IconRandom},
    data: () => ({
        selectedKeys: ['/dashboard'],
        subInputVisible: false,
        subInputKeyword: ''
    }),
    computed: {
        ...mapState(useGlobalStore, ['isDark', 'loading', 'loadingText']),
        ...mapState(useSettingStore, ['codeLightTheme', 'codeDarkTheme']),
        codeTheme() {
            if (this.isDark) {
                return this.codeLightTheme;
            } else {
                return this.codeDarkTheme;
            }
        }
    },
    watch: {
        '$route': {
            handler(newValue) {
                const path = newValue.path as string;
                const name = newValue.name as string;
                if (path !== this.selectedKeys[0]) {
                    this.selectedKeys[0] = path;
                }
                let operate = name;
                let additional = undefined;
                if (name) {
                    const items = name.split("|");
                    if (items.length > 1) {
                        operate = items[0];
                        additional = items[1];
                    }
                }
                statistics.access(operate, additional);
            }
        },
        selectedKeys(newValue) {
            this.$router.push(newValue[0]);
        }
    },
    created() {
        if (this.isDark) {
            // 设置为暗黑主题
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            // 恢复亮色主题
            document.body.removeAttribute('arco-theme');
        }
        this.selectedKeys = [this.$route.path];
        // TODO: 初始化数据
    },
    methods: {}
});
</script>
<style lang="less"></style>
