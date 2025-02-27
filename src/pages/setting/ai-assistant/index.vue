<template>
  <page-layout title="AI 助手">
    <template #extra>
      <t-button theme="primary" @click="addAiAssistant">
        新增
      </t-button>
    </template>
    <t-list :split="true">
      <t-list-item v-for="a in assistants" :key="a.id">
        <t-list-item-meta :title="a.name">
          <template #description>
            <div class="ellipsis-3">{{ a.system }}</div>
          </template>
        </t-list-item-meta>
        <template #action>
          <t-button variant="text" theme="primary" shape="square" @click="editAiAssistant(a)" >
            <template #icon>
              <icon-edit/>
            </template>
          </t-button>
          <t-popconfirm content="确定要删除此助手？" ok-text="删除" @ok="handleRemove(a.id)">
            <t-button variant="text" theme="danger" shape="square">
              <template #icon>
                <icon-delete/>
              </template>
            </t-button>
          </t-popconfirm>
        </template>
      </t-list-item>
    </t-list>
  </page-layout>
</template>
<script lang="ts" setup>
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {addAiAssistant, editAiAssistant} from "@/pages/setting/ai-assistant/modal";
import MessageUtil from "@/utils/modal/MessageUtil";

const assistants = computed(() => useAiAssistantStore().aiAssistants);

function handleRemove(id: string) {
  useAiAssistantStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e));
}
</script>
<style scoped lang="less">

</style>
