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
        <a-upload draggable style="margin-top: 7px;" list-type="picture" :custom-request="customerUpload" :file-list="fileList"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {StrategyResult} from "@/plugin/sdk/LskyPro";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {FileItem, RequestOption, UploadRequest} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";


const strategies = ref(new Array<StrategyResult>());
const strategyId = ref(useLskyProSettingStore().option.strategyId);
const strategyLoad = ref(false);
const fileList = ref(new Array<FileItem>());

const disabled = computed(() => !useLskyProSettingStore().isLogin || strategyLoad.value);

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
    const result = useLskyProSettingStore().instance.upload(option.fileItem.file,
            rsp => {
                option.onSuccess();
                fileList.value.push({
                    uid: rsp.key,
                    name: rsp.name,
                    url: rsp.links.url,
                })
            },
            msg => MessageUtil.error("上传失败", msg),
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
}
</style>
