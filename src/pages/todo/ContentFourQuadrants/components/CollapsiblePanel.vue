<template>
  <div class="collapsible-panel" :class="panelClass">
    <div class="collapsible-header" @click="$emit('toggle')">
      <div class="collapsible-title">
        {{ title }} ({{ count }})
      </div>
      <div class="collapsible-icon">
        <caret-down-small-icon v-if="!collapsed" size="16px"/>
        <caret-right-small-icon v-else size="16px"/>
      </div>
    </div>
    <div class="collapsible-content" v-show="!collapsed">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CaretDownSmallIcon, CaretRightSmallIcon } from "tdesign-icons-vue-next";

interface Props {
  title: string;
  count: number;
  collapsed: boolean;
  panelClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  panelClass: ''
});

defineEmits<{
  (e: 'toggle'): void;
}>();
</script>

<style scoped lang="less">
.collapsible-panel {
  margin-top: 0;
  border-top: 1px dashed var(--td-component-stroke);
  margin-bottom: 16px;
  border-top: none;
  border-bottom: 1px dashed var(--td-component-stroke);

  .collapsible-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 4px;
    cursor: pointer;
    color: var(--td-text-color-secondary);
    font-size: 13px;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }
  }

  .collapsible-content {
    padding-top: 4px;
  }
}
</style>