<template>
  <t-select v-model="activeKey" :options="serviceOptions" :auto-width="true" :filterable="true"
            placeholder="请选择 AI 服务" class="home-assistant-select"/>
</template>
<script lang="ts" setup>
import {SelectOption} from "tdesign-vue-next";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";

const activeKey = defineModel<string>({
  default: ''
})

const serviceOptions = computed<Array<SelectOption>>(() => {
  const {aiServices} = useAiServiceStore();
  return aiServices.map(a => ({
    group: a.name,
    label: a.name,
    children: a.models.map(e => {
      const label = `${typeof e === 'string' ? e : e.label}`;
      const value = `${a.id}/${typeof e === 'string' ? e : e.id}`;
      return {
        content: label,
        label,
        value
      }
    })
  }))
});

</script>
<style scoped lang="less">
.home-assistant-select {
  :deep(.t-select) {
    width: 112px;
    height: var(--td-comp-size-m);
    margin-right: var(--td-comp-margin-s);

    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }

    .t-input.t-is-focused {
      box-shadow: none;
    }
  }
}
</style>
