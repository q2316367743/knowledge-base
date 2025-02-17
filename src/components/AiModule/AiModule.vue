<template>
  <a-input-group>
    <a-select v-model="model" allow-clear allow-search :loading="loading" placeholder="模型">
      <a-option v-for="model in models" :value="model">{{ model }}</a-option>
      <template #footer>
        <div style="width: 100%;text-align: center">
          <a-button type="text" :disabled="instance.api === '' || instance.token === ''"
                    @click="getAllModules()" :loading="loading">刷新
          </a-button>
        </div>
      </template>
    </a-select>
  </a-input-group>
</template>
<script lang="ts" setup>
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {ref} from "vue";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/modal/MessageUtil";
import {ChatSetting} from "@/entity/setting/ChatSetting";

const model = defineModel({
  type: String,
  default: () => 'gpt-3.5-turbo'
});

const models = ref(getItemByDefault(LocalNameEnum.KEY_CHAT_MODELS, [
  "gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-0613",
  "gpt-3.5-turbo-16k", "gpt-3.5-turbo-16k-0613", "gpt-4-turbo-preview", "gpt-4-0125-preview",
  "gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-0613", "gpt-4-32k"]));
const loading = ref(false);

const instance = computed<ChatSetting>(() => useChatSettingStore().chatSetting);


function getAllModules() {
  (async () => {
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
  })().catch(e => MessageUtil.error("获取失败", e));
}
</script>
<style scoped lang="less">

</style>
