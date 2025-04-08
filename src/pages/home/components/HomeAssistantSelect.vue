<template>
  <t-space class="home-assistant-select items-center" size="small">
    <t-button theme="primary" variant="text" shape="square" @click="goBack">
      <template #icon>
        <home-icon/>
      </template>
    </t-button>
    <chevron-right-icon/>
    <t-select v-model="serviceId" :options="serviceOptions" :auto-width="true" placeholder="请选择 AI 服务"
              class="home-assistant-select-service">
      <template #panel-bottom-content>
        <div class="w-full flex justify-center mt-4 mb-4">
          <t-button size="small" @click="toAiService">管理</t-button>
        </div>
      </template>
    </t-select>
    <chevron-right-icon/>
    <t-select v-model="assistantId" :options="assistantOptions" :auto-width="true" placeholder="请选择 AI 助手"
              class="home-assistant-select-assistant">
      <template #panel-bottom-content>
        <div class="w-full flex justify-center mt-4 mb-4">
          <t-button size="small" @click="toAiAssistant">管理</t-button>
        </div>
      </template>
    </t-select>
  </t-space>
</template>
<script lang="ts" setup>
import {SelectOption} from "tdesign-vue-next";
import {ChevronRightIcon, HomeIcon} from "tdesign-icons-vue-next";
import {assistantId, serviceId, useChatStore} from "@/store";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";

const router = useRouter();

const toAiService = () => router.push("/setting/ai-service");
const toAiAssistant = () => router.push("/setting/ai-assistant");

const assistantOptions = computed<Array<SelectOption>>(() => {
  const {aiAssistants} = useAiAssistantStore();
  return aiAssistants.filter(a => a.aiServiceId === serviceId.value).map(a => ({
    content: a.name,
    label: a.name,
    value: a.id,
    title: a.description || a.system || a.name
  }))
});
const serviceOptions = computed<Array<SelectOption>>(() => {
  const {aiServices} = useAiServiceStore();
  return aiServices.map(a => ({
    content: a.name,
    label: a.name,
    value: a.id,
  }))
});

const goBack = () => useChatStore().clear();
</script>
<style scoped lang="less">
.home-assistant-select {
  height: 32px;

  .home-assistant-select__wrap {
    padding: 0 8px;
    width: fit-content;
    max-width: calc(100% - 16px);
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--td-border-level-1-color);
    user-select: none;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
      border: 1px solid var(--td-border-level-2-color);
    }

    .name {
      max-width: calc(100% - 20px);
    }

    .down {
      transform: rotate(0deg);
      transition: transform 0.3s;

      &.reverse {
        transform: rotate(180deg);
      }
    }

  }
}
</style>
