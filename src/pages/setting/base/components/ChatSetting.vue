<template>
  <div class="more-setting-chat">
    <a-alert type="error">此处设置已废弃，请千万 AI 服务中设置，当前仅作备份，下个版本删除。</a-alert>
    <a-form :model="instance" layout="vertical" style="margin-top: 7px;">
      <a-form-item label="是否启用">
        <a-switch v-model="instance.enable" type="round" disabled/>
      </a-form-item>
      <a-form-item label="API" v-if="instance.enable">
        <a-input v-model="instance.api" style="width: 400px;" disabled/>
        <template #help>如无特殊需求，请勿修改</template>
      </a-form-item>
      <a-form-item label="token" v-if="instance.enable">
        <a-input-password v-model.trim="instance.token" style="width: 600px;" disabled/>
      </a-form-item>
      <a-form-item label="模型" v-if="instance.enable">
          <a-select v-model="instance.model" style="width: 250px;" allow-clear allow-search disabled>
            <a-option v-for="model in models" :value="model">{{ model }}</a-option>
          </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import {clone} from "@/utils/lang/ObjectUtil";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {ChatSetting} from "@/entity/setting/ChatSetting";
import {getItemByDefault} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const instance = ref<ChatSetting>(clone(useChatSettingStore().chatSetting, true));
const models = ref(getItemByDefault(LocalNameEnum.KEY_CHAT_MODELS, [
  "gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k", "gpt-3.5-turbo-16k-0613", "gpt-4-turbo-preview", "gpt-4-0125-preview",
  "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613", "gpt-4-32k"]));
// TODO: 下版本删除
</script>
<style scoped>
</style>
