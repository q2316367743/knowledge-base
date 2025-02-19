<template>
  <page-layout title="AI 助手">
    <template #extra>
      <a-button type="primary" @click="addAiAssistant">
        新增
      </a-button>
    </template>
    <a-list :bordered="false" hoverable>
      <a-list-item v-for="a in assistants" :key="a.id">
        <a-list-item-meta :title="a.name">
          <template #description>
            <div class="ellipsis-3">{{ a.system }}</div>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a-button type="text" @click="editAiAssistant(a)">
            <template #icon>
              <icon-edit/>
            </template>
          </a-button>
          <a-popconfirm content="确定要删除此助手？" ok-text="删除" @ok="handleRemove(a.id)">
            <a-button type="text" status="danger">
              <template #icon>
                <icon-delete/>
              </template>
            </a-button>
          </a-popconfirm>
        </template>
      </a-list-item>
    </a-list>
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
