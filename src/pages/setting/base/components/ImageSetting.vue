<template>
    <div class="more-setting-image">
        <a-tabs v-model:active-key="activeKey" lazy-load animation type="text">
            <template #extra>
                <a-button type="outline" @click="save()">保存</a-button>
            </template>
            <a-tab-pane key="qi-niu" title="七牛云">
                <a-form :model="instance.qiNui" layout="vertical">
                    <a-form-item label="AccessKey">
                        <a-input v-model:value="instance.qiNui.accessKey" allow-clear style="width: 400px"/>
                    </a-form-item>
                    <a-form-item label="SecretKey">
                        <a-input-password v-model:value="instance.qiNui.secretKey" allow-clear style="width: 400px"/>
                    </a-form-item>
                    <a-form-item label="bucket">
                        <a-input v-model:value="instance.qiNui.bucket" allow-clear style="width: 400px"/>
                    </a-form-item>
                    <a-form-item label="区域">
                        <a-input v-model:value="instance.qiNui.region" allow-clear style="width: 400px"/>
                    </a-form-item>
                    <a-form-item label="使用cdn加速">
                        <a-switch v-model:value="instance.qiNui.useCdn"/>
                    </a-form-item>
                    <a-form-item label="path">
                        <a-input v-model:value="instance.qiNui.path" allow-clear style="width: 400px"/>
                    </a-form-item>
                    <a-form-item label="域名">
                        <a-input v-model:value="instance.qiNui.domain" allow-clear style="width: 400px"/>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="ali-oss" title="阿里云OSS">
            </a-tab-pane>
        </a-tabs>

    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {clone} from "xe-utils";
import {useImageSettingStore} from "@/store/setting/ImageSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useRouter} from "vue-router";

const router = useRouter();

const instance = ref(clone(useImageSettingStore().imageSetting, true));
const activeKey = ref('qi-niu');

function save() {
    useImageSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}
</script>
<style scoped>
.more-setting-image {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
    overflow: auto;
}
</style>
