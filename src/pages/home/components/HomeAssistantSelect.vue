<template>
  <div class="home-assistant-select">
    <a-dropdown position="bottom">
      <div class="home-assistant-select__wrap">
        {{ aiAssistantMap.get(value)?.name || '请选择' }}
      </div>
      <template #content>
        <a-doption v-for="a in aiAssistants" :key="a.id" @click="handleChange(a.id)">{{ a.name }}</a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";

const value = defineModel({
  type: String,
  default: ''
});

const aiAssistants = computed(() => useAiAssistantStore().aiAssistants);
const aiAssistantMap = computed(() => useAiAssistantStore().aiAssistantMap);

function handleChange(id: string) {
  value.value = id;
}
</script>
<style scoped lang="less">
.home-assistant-select {
  width: 100%;
  height: 32px;
  text-align: right;
  line-height: 32px;
  border-radius: var(--border-radius-medium);
  display: flex;
  flex-direction: row-reverse;

  .home-assistant-select__wrap {
    padding: 0 8px;
    width: fit-content;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--color-fill-1);
    }
  }
}
</style>
