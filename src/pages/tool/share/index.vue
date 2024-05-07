<template>
    <a-layout>
        <a-layout-header>
            <a-tabs v-model:active-key="activeKey" hide-content>
                <a-tab-pane :key="PluginSettingTypeEnum.THEME" title="主题"/>
                <a-tab-pane :key="PluginSettingTypeEnum.MARKDOWN_MENU" title="markdown菜单"/>
                <a-tab-pane :key="PluginSettingTypeEnum.MARKDOWN_SYNTAX" title="markdown语法"/>
                <a-tab-pane :key="PluginSettingTypeEnum.RICH_TEXT_PLUGIN" title="富文本语法"/>
                <a-tab-pane :key="PluginSettingTypeEnum.MARKDOWN_TEMPLATE" title="markdown模板"/>
                <template #extra>
                    <a-button type="text" style="margin-right: 7px">我的</a-button>
                </template>
            </a-tabs>
        </a-layout-header>
        <a-layout-content style="margin: 7px">
            <a-list :max-height="height" :loading="loading">
                <a-list-item v-for="script in scripts" :key="script.id">
                    <a-list-item-meta :title="script.name" :description="script.description"/>
                    <template #actions>
                        <a-button type="text">下载</a-button>
                    </template>
                </a-list-item>
            </a-list>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import { PluginCategoryScriptList} from "@/plugin/sdk/UtoolsShareManage/types";
import {getPluginCategoryList, page} from "@/plugin/sdk/UtoolsShareManage/api";
import {useWindowSize} from "@vueuse/core";
import {PluginSettingTypeEnum} from "@/entity/setting/PluginSetting";

const windowSize = useWindowSize();

const activeKey = ref(PluginSettingTypeEnum.THEME);
const scripts = ref<Array<PluginCategoryScriptList>>([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);

const height = computed(() => windowSize.height.value - 46);


watch(activeKey, categoryId => {
    scripts.value = [];
    loading.value = true;
    page(categoryId).then(pagination => {
        scripts.value = pagination.records || [];
        current.value = pagination.page || 1;
        size.value = pagination.size || 20;
    }).finally(() => loading.value = false);
}, {immediate: true})

</script>
<style scoped>

</style>
