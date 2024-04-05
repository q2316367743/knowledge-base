<template>
    <a-layout class="setting-plugin">
        <a-layout-sider :width="300">
            <setting-plugin-side @select="onSelect"/>
        </a-layout-sider>
        <a-layout-content>
            <setting-plugin-content :plugin="plugin" v-if="load"/>
            <a-result v-else title="请前往主题设置中设置" style="margin-top: 15vh;"/>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import { ref} from "vue";
import { usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {PluginSettingIndex} from "@/entity/setting/PluginSetting";
import SettingPluginSide from "@/pages/setting/plugin/SettingPluginSide.vue";
import SettingPluginContent from "@/pages/setting/plugin/SettingPluginContent.vue";

const plugin = ref<PluginSettingIndex>();
const load = ref(false);


function onSelect(selectKey: string | number) {
    // 文件
    load.value = false;
    plugin.value = usePluginSettingStore().pluginMap.get(selectKey as number);
    load.value = !!plugin.value;
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
