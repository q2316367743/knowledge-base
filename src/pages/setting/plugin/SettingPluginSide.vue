<template>
    <a-layout class="setting-plugin-side">
        <a-layout-header>
            <a-button type="text" @click="toHelp()">
                <template #icon>
                    <icon-question/>
                </template>
                使用帮助
            </a-button>
        </a-layout-header>
        <a-layout-content>

            <a-tree block-node animation :data="pluginTree" :virtual-list-props="virtualListProps"
                    @select="onSelect">
                <template #extra="nodeData">
                    <a-dropdown v-if="nodeData.isLeaf">
                        <a-button type="text">
                            <template #icon>
                                <icon-more/>
                            </template>
                        </a-button>
                        <template #content>
                            <a-doption @click="editPlugin(nodeData)">
                                <template #icon>
                                    <icon-edit/>
                                </template>
                                重命名
                            </a-doption>
                            <a-doption @click="removePlugin(nodeData.key)">
                                <template #icon>
                                    <icon-delete/>
                                </template>
                                删除
                            </a-doption>
                        </template>
                    </a-dropdown>
                    <a-button type="text" v-else @click="createPlugin(nodeData.key)">
                        <template #icon>
                            <icon-plus/>
                        </template>
                    </a-button>
                </template>
            </a-tree>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import {useWindowSize} from "@vueuse/core";
import {contains} from "@/utils/lang/ArrayUtil";
import {PLUGIN_FOLDER_KEYS, usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {createPlugin, editPlugin, removePlugin} from "@/pages/setting/plugin/components/operation";
import Constant from "@/global/Constant";

const emits = defineEmits(['select']);

const size = useWindowSize();


const pluginTree = computed(() => usePluginSettingStore().pluginTree);
const virtualListProps = computed(() => ({
    height: size.height.value - 21 - 32
}));
const toHelp = () => utools.shellOpenExternal(Constant.help.plugin);

function onSelect(selectedKeys: Array<string | number>) {
    const selectKey = selectedKeys[0];
    if (contains(PLUGIN_FOLDER_KEYS, selectKey)) {
        emits('select');
    } else {
        // 文件
        emits('select', selectedKeys[0]);
    }
}

</script>
<style scoped>
.setting-plugin-side {
    padding: 7px;
}
</style>
