<template>
  <div class="ai-assistant">
    <header class="assistant-header">
      <t-input v-model="keyword" placeholder="请输入助手名称" class="w-200px">
        <template #prefix-icon>
          <search-icon/>
        </template>
      </t-input>
      <t-space size="small" class="items-center">
        <t-checkbox v-model="showUTools" v-if="uToolsModels.length > 0">显示内置助手</t-checkbox>
        <t-button theme="primary" @click="addAiAssistant">新增</t-button>
      </t-space>
    </header>
    <main class="assistant-content">
      <t-list :split="true">
        <t-list-item v-for="{item} in results" :key="item.id">
          <t-list-item-meta :title="item.name" :image="item.icon">
            <template #description>
              <div class="ellipsis-3">{{ item.system || item.description }}</div>
            </template>
          </t-list-item-meta>
          <template #action v-if="item.default">
            <t-tag>uTools服务</t-tag>
          </template>
          <template #action v-else>
            <t-button variant="text" theme="primary" shape="square" @click="editAiAssistant(item)">
              <template #icon>
                <edit2-icon/>
              </template>
            </t-button>
            <t-popconfirm content="确定要删除此助手？" confirm-btn="删除" @confirm="handleRemove(item.id)">
              <t-button variant="text" theme="danger" shape="square">
                <template #icon>
                  <delete-icon/>
                </template>
              </t-button>
            </t-popconfirm>
          </template>
        </t-list-item>
      </t-list>
    </main>
  </div>
</template>
<script lang="ts" setup>
import {DeleteIcon, Edit2Icon, SearchIcon} from "tdesign-icons-vue-next";
import {addAiAssistant, editAiAssistant} from "@/pages/setting/ai-assistant/modal";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiAssistantStore, useAiServiceStore} from "@/store";
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useFuse} from "@vueuse/integrations/useFuse";

const showUTools = useUtoolsKvStorage<boolean>(LocalNameEnum.KEY_SETTING_AI_ASSISTANT_SHOW_U_TOOLS, true);

const keyword = ref('')

const uToolsModels = computed(() => useAiServiceStore().innerAiService?.models || []);
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

const {results} =useFuse(keyword, assistants, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys:  ['name', 'system', 'model']
  }
}) 

function handleRemove(id: string) {
  useAiAssistantStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));
}
</script>
<style scoped lang="less">
.ai-assistant {

  .assistant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--td-border-level-2-color);
    padding-bottom: 8px;
  }
}
</style>
