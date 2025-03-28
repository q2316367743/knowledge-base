<template>
  <div class="reasoning">
    <div class="reasoning-header" @click="toggle()">
      <div class="flex items-center">
        <chat-loading animation="gradient" v-if="think"/>
        <check-circle-icon class="reasoning-header-icon" v-else/>
        <div class="reasoning-header-text">{{ think ? '思考中...' : '已深度思考'}}</div>
      </div>
      <chevron-down-icon :class="{visible, 'reasoning-header-down': true}"/>
    </div>
    <div class="reasoning-body" v-if="visible">
      <div class="reasoning-content">
        {{ text }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {CheckCircleIcon, ChevronDownIcon} from "tdesign-icons-vue-next";
import {ChatLoading} from '@tdesign-vue-next/chat';

defineProps({
  text: String,
  think: Boolean
});

const visible = ref(true);
const toggle = useToggle(visible);
</script>
<style scoped lang="less">
.reasoning {
  background-color: var(--td-bg-color-secondarycontainer);
  border-radius: var(--td-radius-medium);
  overflow: hidden;

  .reasoning-header {
    cursor: pointer;
    border-bottom: none;
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-m);
    font: var(--td-font-body-medium);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .reasoning-header-icon {
      color: var(--td-success-color);
      margin-right: 8px;
    }


    .reasoning-header-down {
      transform: rotate(180deg);
      transition: transform 0.3s ease-in-out;

      &.visible {
        transform: rotate(0);
      }
    }
  }

  .reasoning-body {
    border: none;

    .reasoning-content {
      overflow: hidden;
      padding: 0 var(--td-comp-paddingTB-m) var(--td-comp-paddingTB-s) var(--td-comp-paddingTB-m);
      line-height: 1.2;
      color: var(--td-text-color-placeholder);
      font-weight: 400;
      font-size: var(--td-font-size-body-medium);
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
