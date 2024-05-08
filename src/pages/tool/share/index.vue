<template>
    <a-layout>
        <a-layout-header>
            <a-tabs v-model:active-key="activeKey" hide-content>
                <a-tab-pane v-for="pluginType in pluginTypes" :key="pluginType.key" :title="pluginType.title"/>
                <template #extra>
                    <a-button-group type="text">
                        <a-button style="margin-right: 7px" v-if="isUtools" @click="submitModal()">提交</a-button>
                        <a-button style="margin-right: 7px" v-if="isUtools" @click="openMyself()">我的</a-button>
                    </a-button-group>
                </template>
            </a-tabs>
        </a-layout-header>
        <a-layout-content style="margin: 7px">
            <a-list :max-height="height" :loading="loading">
                <a-list-item v-for="script in scripts" :key="script.id">
                    <a-list-item-meta :title="script.name" :description="script.description"/>
                    <a-space class="mt-7">
                        <a-avatar :image-url="script.createAvatar" :size="24"></a-avatar>
                        {{script.createName}}
                        <a-tag color="orange">
                            <template #icon>
                                <icon-clock-circle />
                            </template>
                            {{script.verityTime}}
                        </a-tag>
                        <a-tag color="arcoblue">
                            <template #icon>
                                <icon-download />
                            </template>
                            {{script.downloadCount}}
                        </a-tag>
                        <a-tag color="arcoblue">
                            <template #icon>
                                <icon-heart />
                            </template>
                            {{script.likeCount}}
                        </a-tag>
                        <a-tag color="arcoblue" v-if="activeKey === 0">
                            <template #icon>
                                <icon-tags />
                            </template>
                            {{script.categoryName}}
                        </a-tag>
                    </a-space>
                    <template #actions>
                        <a-button-group type="text">
                            <a-button @click="openHistory(script.id || 0)">历史记录</a-button>
                            <a-popconfirm content="是否卸载插件" v-if="installIds.indexOf(script.id || 0) > -1 &&
                                  installApplicationIds.indexOf(script.lastApplicationId || 0) > -1"
                                          @ok="uninstall(script.id)">
                                <a-button status="danger">卸载</a-button>
                            </a-popconfirm>
                            <a-button status="success" @click="install(script.id)"
                                      v-else-if="installIds.indexOf(script.id || 0) > -1 &&
                                  installApplicationIds.indexOf(script.lastApplicationId || 0) === -1">更新
                            </a-button>
                            <a-button @click="install(script.id)" v-else>下载</a-button>
                        </a-button-group>
                    </template>
                </a-list-item>
            </a-list>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {download, page} from "@/plugin/sdk/UtoolsShareManage/api/PluginScriptPublic";
import {useWindowSize} from "@vueuse/core";
import {isUtools} from "@/global/BeanFactory";
import {pluginTypes, usePluginSettingStore} from "@/store/db/PluginSettingStore";
import {openMyself} from "@/pages/tool/share/myself";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {openHistory} from "@/pages/tool/share/history";
import {submitModal} from "@/pages/tool/share/submit";
import {PluginCategoryScriptList} from "@/plugin/sdk/UtoolsShareManage/types/PluginScript";

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

function uninstall(id?: number) {
    if (!id) {
        MessageUtil.warning("系统异常，脚本ID不存在")
        return;
    }
    usePluginSettingStore().removeApplicationId(id)
        .then(() => MessageUtil.success("卸载成功"))
        .catch(e => MessageUtil.error("卸载失败", e))
}
</script>
<style scoped>

</style>
