<template>
    <div class="lsky-pro-upload">
        <a-space>
            <a-select v-model="strategyId" style="width: 300px;" placeholder="请选择策略" :disabled="disabled">
                <a-option v-for="strategy in strategies" :value="strategy.id">{{ strategy.name }}</a-option>
            </a-select>
            <a-button type="primary" :disabled="disabled" @click="renderStrategy()">
                <template #icon>
                    <icon-refresh/>
                </template>
            </a-button>
            <a-button type="primary" status="danger" :disabled="disabled" @click="clearStrategy()">
                <template #icon>
                    <icon-delete/>
                </template>
            </a-button>
        </a-space>
        <a-upload :disabled="invalid" draggable style="margin-top: 7px;" :custom-request="customerUpload"
                  :show-file-list="false"/>
        <a-alert :type="uploading ? 'info' :'success'" style="margin: 7px 0;">{{
                uploading ? '正在上传中' : '上传完成'
            }}
        </a-alert>
        <a-list :bordered="false" :max-height="maxHeight">
            <a-list-item v-for="item in files">
                <a-link :href="item.links.url">{{ item.name }}</a-link>
                <template #actions>
                    <a-button-group type="text">
                        <a-tooltip content="复制链接">
                            <a-button @click="copyUrl(item)">
                                <template #icon>
                                    <icon-link/>
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip content="复制markdown">
                            <a-button @click="copyMarkdown(item)">
                                <template #icon>
                                    <icon-edit/>
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip content="查看详情">
                            <a-button @click="openInfo(item)">
                                <template #icon>
                                    <icon-info-circle/>
                                </template>
                            </a-button>
                        </a-tooltip>
                    </a-button-group>
                </template>
            </a-list-item>
        </a-list>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {CommonResult, StrategyResult} from "@/plugin/sdk/LskyPro";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {RequestOption, UploadRequest} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";
import {copyMarkdown, copyUrl, openInfo} from "@/pages/setting/lsky-pro/domain/func";
import {useWindowSize} from "@vueuse/core";

const size = useWindowSize();

const strategies = ref(new Array<StrategyResult>());
const strategyId = ref(useLskyProSettingStore().option.strategyId);
const strategyLoad = ref(false);
const files = ref(new Array<CommonResult>());
const uploading = ref(false);

const disabled = computed(() => !useLskyProSettingStore().isLogin || strategyLoad.value);
const invalid = computed(() => !useLskyProSettingStore().isAvailable);
const maxHeight = computed(() => size.height.value - 46 - 7 - 32 - 170 - 40-14);

watch(() => strategyId.value, value => useLskyProSettingStore().update({strategyId: value}))

renderStrategy()

function renderStrategy() {
    if (useLskyProSettingStore().isLogin) {
        strategyLoad.value = true;
        useLskyProSettingStore().instance.strategies()
            .then(rsp => strategies.value = rsp)
            .catch(e => MessageUtil.error("策略获取失败", e))
            .finally(() => strategyLoad.value = false);
    }
}

function clearStrategy() {
    strategyId.value = undefined;
}

function customerUpload(option: RequestOption): UploadRequest {
    if (!option.fileItem.file) {
        option.onError("文件不存在")
        return {
            abort: () => {
            }
        };
    }
    uploading.value = true;
    const result = useLskyProSettingStore().instance.upload(option.fileItem.file,
        rsp => {
            option.onSuccess();
            files.value.push(rsp);
            uploading.value = false;
            console.log(files.value)
        },
        msg => {
            MessageUtil.error("上传失败", msg);
            uploading.value = false;
        },
        {
            onUploadProgress: progressEvent => {
                option.onProgress(progressEvent.progress || 0)
            }
        }
    )
    return {abort: result.abort};
}
</script>
<style scoped>
.lsky-pro-upload {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    overflow-x: hidden;
}
</style>
