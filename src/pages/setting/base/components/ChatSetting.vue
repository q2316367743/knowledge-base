<template>
    <div class="more-setting-chat">
        <a-alert>获取token请前往
            <a-link @click="toApi()">土土金API</a-link>
        </a-alert>
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
                <a-input-group>
                    <a-select v-model="instance.model" style="width: 250px;" allow-clear allow-search>
                        <a-option v-for="model in models" :value="model.id">{{model.id}}</a-option>
                    </a-select>
                    <a-button type="text" :disabled="instance.token === ''" @click="refreshModels()">刷新全部模型
                    </a-button>
                </a-input-group>
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
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {listModels} from "@/components/ChatGPT/api";
import {Datum} from "@/components/ChatGPT/model/Model";

const instance = ref<ChatSetting>(clone(useChatSettingStore().chatSetting, true));

const models = ref(getItemByDefault<Array<Datum>>(LocalNameEnum.KEY_CHAT_MODELS, []));

function save() {
    useChatSettingStore().save(instance.value)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
}

function refreshModels() {
    useChatSettingStore().save(instance.value)
        .then(() => {
            listModels().then(res => {
                models.value = res.data;
                MessageUtil.success("获取模型成功");
                setItem(LocalNameEnum.KEY_CHAT_MODELS, models.value);
            }).catch(e => MessageUtil.error("获取模型失败", e))
        })
        .catch(e => MessageUtil.error("保存失败", e));
}

const toApi = () => utools.shellOpenExternal("https://api.tutujin.com");

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
