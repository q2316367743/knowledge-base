<template>
  <div class="home-assistant-select">
    <t-dropdown :options="options" style="max-width: 160px" trigger="click">
      <div class="home-assistant-select__wrap flex items-center ">
        <div class="mr-6px relative name">
          <div v-if="assistant" class=" ellipsis" :title="assistant.name">{{ assistant.name }}</div>
          <div v-else style="color: var(--color-text-3)" title="AI 助手">请选择AI助手</div>
        </div>
        <caret-down-icon class="down"/>
      </div>
    </t-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {DropdownProps} from "tdesign-vue-next";
import {CaretDownIcon} from "tdesign-icons-vue-next";

const assistantId = defineModel({
  type: String,
  default: ''
})

defineProps({
  width: {
    type: String,
    default: '120px'
  }
});

const assistant = computed<AiAssistant | undefined>(() => {
  const {aiAssistantMap} = useAiAssistantStore();
  return aiAssistantMap.get(assistantId.value)
});
const options = computed<DropdownProps['options']>(() => {
  const {aiAssistants} = useAiAssistantStore();
  return aiAssistants.map(a => ({
    content: a.name,
    value: a.id,
    onClick: () => handleChange(a.id)
  }))
})

function handleChange(id: string) {
  assistantId.value = id;
}
</script>
<style scoped lang="less">
.home-assistant-select {
  max-width: v-bind(width);
  height: 32px;
  text-align: right;
  line-height: 32px;
  border-radius: var(--border-radius-medium);
  display: flex;
  flex-direction: row-reverse;
  background-color: var(--td-bg-color-container);

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
