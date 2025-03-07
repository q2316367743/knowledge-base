<template>
  <t-guide
    v-model="current"
    :steps="steps"
    :skip-button-props="{content: '不再提示'}"
    @skip="handleFinally"
    @finish="handleFinally"
  />
</template>
<script lang="ts" setup>
import {GuideProps} from 'tdesign-vue-next';
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

const current = ref(-1);
const steps: GuideProps['steps'] = [
  {
    element: '.home-setting',
    title: 'AI 设置',
    body: '首先在这里设置 AI 服务和 AI 助手',
    placement: 'bottom-right',
  },
  {
    element: '.home-assistant-select-service',
    title: 'AI 服务',
    body: '再来这里选择 AI 服务',
    placement: 'bottom-right',
  },
  {
    element: '.home-assistant-select-assistant',
    title: '选择 AI 助手',
    body: '再来这里选择 AI 助手',
    placement: 'bottom',
  },
  {
    element: '.ai-input-textarea',
    title: '输入你的问题',
    body: '在此处输入你想问的问题，Shift + Enter进行换行',
    placement: 'bottom',
  },
  {
    element: '.ai-input-send',
    title: '提问',
    body: '点击此处或按回撤进行提问',
    placement: 'right',
  },
];

onMounted(() => {
  if (!getItemByDefault(LocalNameEnum.GUIDE_HOME_WELCOME, false)) {
    current.value = 0;
  }
})

function handleFinally() {
  setItem(LocalNameEnum.GUIDE_HOME_WELCOME, true)
}
</script>
<style scoped lang="less">

</style>
