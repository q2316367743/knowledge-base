<template>
  <div class="encrypt-text-edit w-full h-full">
    <div class="encrypt-text-edit-header flex justify-between items-center">
      <div class="encrypt-text-edit-header-title flex">
        <div class="encrypt-text-edit-header-title-text">加密文本</div>
        <div class="encrypt-text-edit-header-title-tip">
          <lock-off-icon style="color: var(--td-text-color-disabled)"/>
          <span class="ml-1">未设置密码，将明文显示</span>
        </div>
      </div>
      <div class="encrypt-text-edit-header-password">
        <t-button theme="primary" variant="text" size="small">
          <template #icon>
            <lock-on-icon/>
          </template>
          设置密码
        </t-button>
      </div>
    </div>
    <div class="encrypt-text-edit-content">
      <textarea @keydown="onKeyDown"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {LockOffIcon, LockOnIcon} from "tdesign-icons-vue-next";

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Enter") {
    e.stopPropagation();
  }
}
</script>
<style scoped lang="less">
.encrypt-text-edit {
  position: relative;

  .encrypt-text-edit-header {
    padding: 4px 8px 4px 16px;
    height: 32px;

    .encrypt-text-edit-header-title-tip {
      margin-left: 12px;
      color: var(--td-text-color-placeholder);
      user-select: none;
    }
  }

  .encrypt-text-edit-content {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;

    textarea {
      width: calc(100% - 32px);
      height: 100%;
      border: 0;
      outline: none;
      resize: none;
      padding: 0 16px;
      line-height: 1.5;
      background: transparent;
      overflow: auto;
      touch-action: manipulation;
      margin: 0;
    }

  }
}
</style>
