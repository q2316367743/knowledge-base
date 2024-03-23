<template>
    <div class="more-setting-chat">
        <a-alert>推荐使用<a-link @click="toApi()">V3 API</a-link>，无需科学上网，即可使用。</a-alert>
        <a-alert type="warning" style="margin: 7px 0;">注意，V3 API的api链接地址需要后面拼接v1，例如：https://api.gpt.ge/v1</a-alert>
        <a-form :model="instance" layout="vertical">
            <a-form-item label="是否启用">
                <a-switch v-model="instance.enable" type="round"/>
            </a-form-item>
            <a-form-item label="API" v-if="instance.enable">
                <a-input v-model="instance.api" style="width: 400px;"/>
                <template #help>如无特殊需求，请勿修改</template>
            </a-form-item>
            <a-form-item label="token" v-if="instance.enable">
                <a-input-password v-model.trim="instance.token" style="width: 600px;"/>
            </a-form-item>
            <a-form-item label="模型" v-if="instance.enable">
                <a-select v-model="instance.model" style="width: 250px;" allow-clear allow-search>
                    <a-option v-for="model in models" :value="model">{{ model }}</a-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="save()">保存</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "xe-utils";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {ChatSetting} from "@/entity/setting/ChatSetting";

const instance = ref<ChatSetting>(clone(useChatSettingStore().chatSetting, true));

const models = ref(["gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-16k", "gpt-3.5-turbo-16k-0613", "gpt-4-turbo-preview", "gpt-4-0125-preview",
    "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613", "gpt-4-32k", "gpt-4-32k-0613",
    "gpt-4-all", "gpts-search-chat", "gpt-4-gizmo-*", "net-gpt-3.5-turbo", "net-gpt-3.5-turbo-16k",
    "net-gpt-4", "gpt-3.5-turbo-instruct", "dall-e-2", "dall-e-3", "dall-e-3-hd", "tts-1", "tts-1-1106",
    "tts-1-hd", "tts-1-hd-1106", "whisper-1", "text-embedding-3-large", "text-embedding-3-small",
    "text-moderation-latest", "text-moderation-stable", "text-davinci-003", "text-davinci-002",
    "text-davinci-edit-001", "text-babbage-001", "text-curie-001", "text-embedding-ada-002",
    "text-embedding-v1", "text-ada-001", "claude-1", "claude-1-100k", "claude-2", "claude-2.0", "claude-2.1",
    "claude-2-100k", "claude-3-haiku-20240307", "claude-3-sonnet-20240229", "claude-3-opus-20240229",
    "gemini-pro", "gemini-pro-vision", "glm-4", "glm-4v", "midjourney", "stable-diffusion"]);

function save() {
    useChatSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}


const toApi = () => utools.shellOpenExternal("https://api.v3.cm/register?aff=6A4f");

</script>
<style scoped>
.more-setting-chat {
    position: absolute;
    top: 7px;
    left: 7px;
    right: 7px;
    bottom: 7px;
    overflow: auto;
}
</style>
