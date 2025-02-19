<template>
  <a-layout class="h-full">
    <a-layout-content style="overflow: auto">
      <a-menu :selected-keys="selectKeys" @menu-item-click="handleSelect">
        <a-menu-item v-for="s in aiServices" :key="s.id" :value="s.id">{{ s.name }}</a-menu-item>
      </a-menu>
    </a-layout-content>
    <a-layout-footer style="padding: 8px;">
      <a-button type="outline" long @click="handleAdd" :disabled="currentId === '0'">新增</a-button>
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import {useAiServiceStore} from "@/store/ai/AiServiceStore";

const currentId = defineModel({
  type: String,
  default: ''
});

const selectKeys = computed(() => ([currentId.value]));
const aiServices = computed(() => useAiServiceStore().aiServices);

function handleAdd() {
  currentId.value = '0';
}

function handleSelect(res: string) {
  currentId.value = res || '';
}

onMounted(() => {
  if (aiServices.value.length > 0) {
    currentId.value = aiServices.value[0].id;
  }
})
</script>
<style scoped lang="less">

</style>
