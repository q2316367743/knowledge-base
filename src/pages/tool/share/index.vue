<template>
    <a-layout>
        <a-layout-header>
            <a-tabs v-model:active-key="activeKey" hide-content>
                <a-tab-pane v-for="pluginType in pluginTypes" :key="pluginType.key" :title="pluginType.title"/>
                <template #extra>
                    <a-button-group type="text">
                        <a-button style="margin-right: 7px" v-if="isUtools">提交</a-button>
                        <a-button style="margin-right: 7px" v-if="isUtools" @click="openMyself()">我的</a-button>
                    </a-button-group>
                </template>
            </a-tabs>
        </a-layout-header>
        <a-layout-content style="margin: 7px">
            <a-list :max-height="height" :loading="loading">
                <a-list-item v-for="script in scripts" :key="script.id">
                    <a-list-item-meta :title="script.name" :description="script.description"/>
                    <template #actions>
                        <a-button type="text" @click="uninstall(script.id)"
                                  v-if="installIds.indexOf(script.id || 0) > -1 &&
                                  installApplicationIds.indexOf(script.lastApplicationId || 0) > -1">卸载
                        </a-button>
                        <a-button type="text" @click="update(script.id)" v-if="installIds.indexOf(script.id || 0) > -1 &&
                                  installApplicationIds.indexOf(script.lastApplicationId || 0) === -1">更新
                        </a-button>
                        <a-button type="text" @click="install(script.id)" v-else>下载</a-button>
                    </template>
                </a-list-item>
            </a-list>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {PluginCategoryScriptList} from "@/plugin/sdk/UtoolsShareManage/types";
import {download, page} from "@/plugin/sdk/UtoolsShareManage/api";
import {useWindowSize} from "@vueuse/core";
import {isUtools} from "@/global/BeanFactory";
import {pluginTypes, usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {openMyself} from "@/pages/tool/share/myself";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useGlobalStore} from "@/store/GlobalStore";

const windowSize = useWindowSize();

const activeKey = ref(0);
const scripts = ref<Array<PluginCategoryScriptList>>([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);

const height = computed(() => windowSize.height.value - 46);
const installIds = computed(() => usePluginSettingStore().installIds);
const installApplicationIds = computed(() => usePluginSettingStore().installApplicationIds);

watch(activeKey, categoryId => {
    scripts.value = [];
    loading.value = true;
    page(categoryId).then(pagination => {
        scripts.value = pagination.records || [];
        current.value = pagination.page || 1;
        size.value = pagination.size || 20;
    }).finally(() => loading.value = false);
}, {immediate: true})

function install(id?: number) {
    if (!id) {
        MessageUtil.warning("系统异常，脚本ID不存在")
        return;
    }
    useGlobalStore().startLoading("正在下载中")
    download(id).then(res => {
        usePluginSettingStore().add({
            name: res.name || '',
            type: res.categoryId || 0,
            originApplicationId: res.applicationId,
            originId: res.id
        }, res.content)
            .then(() => MessageUtil.success("安装成功"))
            .catch(e => MessageUtil.error("安装失败", e))
            .finally(() => useGlobalStore().closeLoading());
    }).catch(e => {
        MessageUtil.error("下载失败", e);
        useGlobalStore().closeLoading();
    });
}

function update(id?: number) {

}

function uninstall(id?: number) {

}
</script>
<style scoped>

</style>
