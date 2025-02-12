<template>
  <div class="more-setting-chat">
    <a-alert>推荐使用
      <a-link @click="toApi()">V3 API</a-link>
      ，无需科学上网，即可使用。
    </a-alert>
    <a-form :model="instance" layout="vertical" style="margin-top: 7px;">
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
          <a-select v-model="instance.model" style="width: 250px;" allow-clear allow-search :loading="loading">
            <a-option v-for="model in models" :value="model">{{ model }}</a-option>
          </a-select>
          <a-button type="text" :disabled="instance.api === '' || instance.token === ''"
                    @click="getAllModules()" :loading="loading">获取全部模型
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
import {clone} from "@/utils/lang/ObjectUtil";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {ChatSetting} from "@/entity/setting/ChatSetting";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const instance = ref<ChatSetting>(clone(useChatSettingStore().chatSetting, true));
const models = ref(getItemByDefault(LocalNameEnum.KEY_CHAT_MODELS, [
  "gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k", "gpt-3.5-turbo-16k-0613", "gpt-4-turbo-preview", "gpt-4-0125-preview",
  "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613", "gpt-4-32k"]));
const loading = ref(false);

function save() {
  useChatSettingStore().save(instance.value)
    .then(() => MessageUtil.success("保存成功"))
    .catch(e => MessageUtil.error("保存失败", e));
}

const toApi = () => utools.shellOpenExternal("https://api.v3.cm/register?aff=6A4f");

function getAllModules() {
  useChatSettingStore().save(instance.value).then(async () => {
    const {openAi} = useChatSettingStore();
    if (openAi) {
      loading.value = true;
      try {
        const res = await openAi.models.list();
        const items = new Array<string>();
        items.push(...res.data.map(e => e.id));
        while (res.hasNextPage()) {
          await res.getNextPage();
          items.push(...res.data.map(e => e.id));
        }
        models.value = items;
        setItem(LocalNameEnum.KEY_CHAT_MODELS, models.value);
        MessageUtil.success("获取成功");
      } catch (e) {
        MessageUtil.error("获取失败", e);
      } finally {
        loading.value = false;
      }
    }
  })
}

</script>
<style scoped>
</style>
