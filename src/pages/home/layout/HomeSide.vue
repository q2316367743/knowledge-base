<template>
  <div class="home-side">
    <t-button theme="primary" :block="true">新聊天</t-button>
    <div class="group">
      <div>分组</div>
      <t-button theme="primary" variant="text" shape="square" size="small" @click="openAddAiChatGroupDialog">
        <template #icon>
          <plus-icon/>
        </template>
      </t-button>
    </div>
    <div class="item" v-for="g in groups" :key="g.id">
      <folder-icon class="icon"/>
      <div class="text ellipsis">{{ g.name }}</div>
      <t-button theme="primary" variant="text" shape="square" size="small" class="more">
        <template #icon>
          <more-icon />
        </template>
      </t-button>
    </div>
    <div class="group">聊天</div>
  </div>
</template>
<script lang="ts" setup>
import {FolderIcon, MoreIcon, PlusIcon} from "tdesign-icons-vue-next";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import {openAddAiChatGroupDialog} from "@/pages/home/modal/AddAiChatGroup";

const groups = computed(() => useAiChatGroupStore().groups);
</script>
<style scoped lang="less">
.home-side {
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  padding: 8px;

  .group {
    user-select: none;
    color: var(--td-text-color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 4px 0;
    padding: 8px 8px 0;
  }

  .item {
    user-select: none;
    color: var(--td-text-color-secondary);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px 8px;
    background-color: var(--td-bg-color-container);
    transition: background-color 0.3s ease-in-out;
    border-radius: var(--td-radius-medium);
    cursor: pointer;

    &:hover {
      background-color: var(--td-bg-color-container-hover);
    }

    &:active {
      background-color: var(--td-bg-color-container-active);
    }
    &.active {
      background-color: var(--td-bg-color-container-active);
    }

    .icon {
      flex: 0 0 14px;
    }

    .text {
      flex: 1 1 auto;
      margin-left: 8px;
    }
    .more {
      flex: 0 0 32px;
    }
  }
}
</style>
