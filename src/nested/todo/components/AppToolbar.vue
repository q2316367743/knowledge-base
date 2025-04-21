<template>
  <div class="app-toolbar">
    <t-button :block="true">开始专注</t-button>
    <t-button :block="true">添加提醒</t-button>
    <t-dropdown :options="options" trigger="click">
      <t-button theme="primary" variant="text" shape="square" >
        <template #icon>
          <setting-icon />
        </template>
      </t-button>
    </t-dropdown>
  </div>
</template>
<script lang="ts" setup>
import {HomeIcon, InfoCircleIcon, SettingIcon} from "tdesign-icons-vue-next";
import {DropdownOption} from "tdesign-vue-next";
import {backToToday} from "@/nested/todo/store";


const options: Array<DropdownOption> = [
  {
    content: '回到今日',
    prefixIcon: () => h(HomeIcon),
    onClick: backToToday
  }, {
    content: '设置',
    prefixIcon: () => h(SettingIcon)
  }, {
   content: '关于',
    prefixIcon: () => h(InfoCircleIcon)
  }
]
</script>
<style scoped lang="less">
.app-toolbar{
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  padding: 8px;
  margin-bottom: 16px;
  box-shadow: var(--td-shadow-1);

  display: grid;
  grid-template-columns: 1fr 1fr 32px;
  gap: 8px;

}
</style>
