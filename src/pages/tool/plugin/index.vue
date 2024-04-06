<template>
    <a-layout class="setting-plugin">
        <a-layout-sider :width="300">
            <setting-plugin-side @select="onSelect"/>
        </a-layout-sider>
        <a-layout-content>
            <setting-plugin-content :plugin="plugin" v-if="load"/>
            <a-result v-else title="主题与插件" status="warning" style="margin-top: 15vh;">
                <template #subtitle>
                    <p>选择左侧的插件进行编辑</p>
                    <p>通过主题与插件，可以自定义您的知识库插件</p>
                    <p>主题、markdown菜单、markdown语法需要设置才可以启用。</p>
                    <p style="color: rgb(var(--warning-6))">请注意，如果修改的主题是正在使用的，修改后需要前往主题设置中刷新主题</p>
                </template>
                <template #extra>
                    <a-space>
                        <a-button type="primary" @click="toHelp">
                            <template #icon>
                                <icon-question />
                            </template>
                            查看帮助
                        </a-button>
                        <a-button type="primary" @click="toSetting">
                            <template #icon>
                                <icon-settings />
                            </template>
                            前往设置
                        </a-button>
                    </a-space>
                </template>
            </a-result>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {nextTick, ref} from "vue";
import {useRouter} from "vue-router";
import Constant from "@/global/Constant";
import {usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingIndex} from "@/entity/setting/PluginSetting";
import SettingPluginSide from "@/pages/tool/plugin/SettingPluginSide.vue";
import SettingPluginContent from "@/pages/tool/plugin/SettingPluginContent.vue";

const router = useRouter();

const plugin = ref<PluginSettingIndex>();
const load = ref(false);

const toHelp = () => utools.shellOpenExternal(Constant.help.plugin);
const toSetting = () => router.push({
    path: '/setting/base',
    query: {
        tab: 'theme'
    }
});

function onSelect(selectKey: string | number) {
    // 文件
    load.value = false;
    nextTick(() => {
        plugin.value = usePluginSettingStore().pluginMap.get(selectKey as number);
        load.value = !!plugin.value;
    })
}


</script>
<style scoped>
.setting-plugin {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
