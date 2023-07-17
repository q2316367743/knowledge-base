<template>
    <a-layout class="article">
        <a-layout-header class="header">
            <a-button-group type="text">
                <a-button @click="triggerCollapsed()">
                    <template #icon>
                        <icon-menu/>
                    </template>
                </a-button>
                <div style="margin-left: 7px">{{ title }}</div>
            </a-button-group>
            <a-button-group type="text">
                <a-button @click="toHome()">
                    <template #icon>
                        <icon-home/>
                    </template>
                </a-button>
                <a-button @click="fullscreen.toggle()">
                    <template #icon>
                        <icon-fullscreen-exit v-if="fullscreen.isFullscreen.value"/>
                        <icon-fullscreen v-else/>
                    </template>
                </a-button>
                <a-dropdown trigger="click" position="br">
                    <a-button>
                        <template #icon>
                            <icon-more-vertical/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="settingVisible = true">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            设置
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-button-group>
        </a-layout-header>
        <a-layout>
            <a-layout-sider :collapsed="collapsed" :collapsed-width="0" :width="200">
                侧边栏
            </a-layout-sider>
            <a-layout-content>
                <div class="container" id="article-container">
                    <a-scrollbar style="height:100%;overflow: auto;">
                        <router-view/>
                    </a-scrollbar>
                </div>
                <a-back-top target-container=".article .arco-scrollbar-container"/>
            </a-layout-content>
        </a-layout>
        <a-modal v-model:visible="settingVisible" title="基础设置" unmount-on-close class="article-setting"
                 :footer="false">
            <more-setting-base @save="settingVisible = false"/>
        </a-modal>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed, ref} from "vue";
import {useArticleInfoStore} from "@/store/component/ArticleInfoStore";
import {useRouter} from "vue-router";
import {useFullscreen} from "@vueuse/core";
import MoreSettingBase from "@/pages/more/setting/base/index.vue";

const router = useRouter();
const collapsed = ref(true);
const id = computed(() => useArticleInfoStore().id);
const title = computed(() => useArticleInfoStore().title);
const fullscreen = useFullscreen();
const settingVisible = ref(false);

function triggerCollapsed() {
    collapsed.value = !collapsed.value;
}

function toHome() {
    router.push("/home")
}

</script>
<style lang="less">
.article {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: var(--color-text-1);
    background-color: var(--color-bg-1);
    z-index: 51;

    .header {
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--color-neutral-3);
        line-height: 34px;
    }

    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;

        .arco-scrollbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            .scrollbar {
                overflow: auto;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;

            }
        }

        img {
            cursor: pointer;
        }

    }
}

.article-setting {
    .arco-modal-body {
        height: 50vh;
    }
}
</style>
