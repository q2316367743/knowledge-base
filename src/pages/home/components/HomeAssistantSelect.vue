<template>
  <div class="home-assistant-select">
    <a-dropdown v-model:popup-visible="popupVisible" style="max-width: 160px">
      <div class="home-assistant-select__wrap flex items-center ">
        <div class="mr-6px relative name">
          <div v-if="assistant" class=" ellipsis" :title="assistant.name">{{ assistant.name }}</div>
          <div v-else style="color: var(--color-text-3)" title="AI 助手">请选择</div>
        </div>
        <icon-down class="down" :class="{reverse: popupVisible}"/>
      </div>
      <template #content>
        <a-doption v-for="a in aiAssistants" :key="a.id" @click="handleChange(a.id)" :title="a.name">{{
            a.name
          }}
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useChatStore} from "@/store/components/ChatStore";

defineProps({
  width: {
    type: String,
    default: '120px'
  }
});

const popupVisible = ref(false);

const assistantId = computed(() => useChatStore().assistantId);
const aiAssistants = computed(() => useAiAssistantStore().aiAssistants);
const assistant = computed<AiAssistant | undefined>(() => {
  const {aiAssistantMap} = useAiAssistantStore();
  return aiAssistantMap.get(assistantId.value)
});

function handleChange(id: string) {
  useChatStore().changeAssistantId(id);
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

  .home-assistant-select__wrap {
    padding: 0 8px;
    width: fit-content;
    max-width: calc(100% - 16px);
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--color-border-1);
    user-select: none;

    &:hover {
      background-color: var(--color-fill-1);
      border: 1px solid var(--color-border-2);
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
