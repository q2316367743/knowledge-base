<template>
  <div class="more-setting-chat">
    <t-alert type="error">此处设置已废弃，请前往 AI 服务中设置，当前仅作备份，下个版本删除。</t-alert>
    <t-form :model="instance" layout="vertical" style="margin-top: 7px;">
      <t-form-item label="是否启用">
        <t-switch v-model="instance.enable" type="round"/>
      </t-form-item>
      <t-form-item label="API" v-if="instance.enable">
        <t-input v-model="instance.api" style="width: 400px;"/>
        <template #help>如无特殊需求，请勿修改</template>
      </t-form-item>
      <t-form-item label="token" v-if="instance.enable">
        <t-input type="password" v-model.trim="instance.token" style="width: 600px;"/>
      </t-form-item>
      <t-form-item label="模型" v-if="instance.enable">
        <t-select v-model="instance.model" style="width: 250px;" allow-clear allow-search>
          <t-option v-for="model in models" :value="model">{{ model }}</t-option>
        </t-select>
      </t-form-item>
    </t-form>
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
