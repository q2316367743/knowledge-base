<template>
    <a-layout>
        <a-layout-header>
            <a-tabs v-model:active-key="activeKey" hide-content>
                <a-tab-pane v-for="category in categories" :key="category.id" :title="category.name"/>
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
import {PluginCategory, PluginCategoryScriptList} from "@/pages/tool/share/types";
import {getPluginCategoryList, page} from "@/pages/tool/share/api";
import {useWindowSize} from "@vueuse/core";

const windowSize = useWindowSize();

const activeKey = ref(0);
const categories = ref<Array<PluginCategory>>([]);
const scripts = ref<Array<PluginCategoryScriptList>>([]);
const current = ref(1);
const size = ref(20);
const loading = ref(false);

const height = computed(() => windowSize.height.value - 46);

getPluginCategoryList().then(items => {
    categories.value = items;
    if (items.length > 0) {
        activeKey.value = items[0].id;
    }
});

watch(activeKey, categoryId => {
    scripts.value = [];
    loading.value = true;
    page(categoryId).then(pagination => {
        scripts.value = pagination.records || [];
        current.value = pagination.page || 1;
        size.value = pagination.size || 20;
    }).finally(() => loading.value = false);
})

</script>
<style scoped>

</style>
