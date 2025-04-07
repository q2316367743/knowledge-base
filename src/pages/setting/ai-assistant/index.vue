<template>
  <page-layout title="AI 助手">
    <template #extra>
      <t-space size="small" class="items-center">
        <t-checkbox v-model="showUTools" v-if="uToolsModels.length > 0">显示内置助手</t-checkbox>
        <t-button theme="primary" @click="addAiAssistant">新增</t-button>
      </t-space>
    </template>
    <t-list :split="true">
      <t-list-item v-for="a in assistants" :key="a.id">
        <t-list-item-meta :title="a.name" :image="a.icon">
          <template #description>
            <div class="ellipsis-3">{{ a.system || a.description }}</div>
          </template>
        </t-list-item-meta>
        <template #action v-if="a.default">
          <t-tag>uTools服务</t-tag>
        </template>
        <template #action v-else>
          <t-button variant="text" theme="primary" shape="square" @click="editAiAssistant(a)">
            <template #icon>
              <edit2-icon/>
            </template>
          </t-button>
          <t-popconfirm content="确定要删除此助手？" confirm-btn="删除" @confirm="handleRemove(a.id)">
            <t-button variant="text" theme="danger" shape="square">
              <template #icon>
                <delete-icon/>
              </template>
            </t-button>
          </t-popconfirm>
        </template>
      </t-list-item>
    </t-list>
  </page-layout>
</template>
<script lang="ts" setup>
import {DeleteIcon, Edit2Icon} from "tdesign-icons-vue-next";
import {addAiAssistant, editAiAssistant} from "@/pages/setting/ai-assistant/modal";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiAssistantStore, useAiServiceStore} from "@/store";
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const showUTools = useUtoolsKvStorage<boolean>(LocalNameEnum.KEY_SETTING_AI_ASSISTANT_SHOW_U_TOOLS, true);

const assistants = computed<Array<AiAssistant>>(() => {
  const {aiAssistants} = useAiAssistantStore();
  return aiAssistants.filter(a => {
    if (!showUTools.value) {
      // 不显示uTools服务
      return !a.default;
    }
    return true;
  })
});
const uToolsModels = computed(() => useAiServiceStore().uToolsModels);

function handleRemove(id: string) {
  useAiAssistantStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));
}
</script>
<style scoped lang="less">

</style>
