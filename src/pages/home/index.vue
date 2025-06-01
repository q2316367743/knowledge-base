<template>
  <div class="home">
    <div class="home-side" :class="{collapsed}">
      <div class="content">
        <div class="flex justify-between items-center mb-12px">
          <div style="font-weight: bold;font-size: var(--td-font-size-title-large)">问一问</div>
          <t-space size="small">
            <t-button theme="primary" variant="text" shape="square">
              <template #icon>
                <search-icon/>
              </template>
            </t-button>
            <t-button theme="primary" variant="text" shape="square" @click="toggleCollapsed()">
              <template #icon>
                <menu-fold-icon v-if="collapsed"/>
                <menu-unfold-icon v-else/>
              </template>
            </t-button>
          </t-space>
        </div>
        <t-row :gutter="8">
          <t-col flex="auto">
            <t-button theme="primary" :block="true" @click="onClick('/home/welcome')">新建对话</t-button>
          </t-col>
          <t-col flex="40px">
            <t-tooltip content="进入临时对话">
              <t-button theme="primary" :block="true" shape="square" variant="outline" @click="onClick('/home/temp')">
                <template #icon>
                  <chat-icon/>
                </template>
              </t-button>
            </t-tooltip>
          </t-col>
        </t-row>
        <div class="group">
          <div>分组</div>
          <t-button theme="primary" variant="text" shape="square" size="small" @click="openAddAiChatGroupDialog">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </div>
        <div class="item" v-for="g in groups" :key="g.id" :class="{active: activeKey === `/home/group/${g.id}`}"
             @click="onClick(`/home/group/${g.id}`)">
          <folder-icon class="icon"/>
          <div class="text ellipsis">{{ g.name }}</div>
          <t-button theme="primary" variant="text" shape="square" size="small" class="more">
            <template #icon>
              <more-icon/>
            </template>
          </t-button>
        </div>
        <div class="group" v-if="tops.length > 0">置顶</div>
        <div class="item" v-for="i in tops" :key="i.id" :class="{active: activeKey === `/home/chat/0/${i.id}`}"
             @click="onClick(`/home/chat/0/${i.id}`)">
          <div class="text ellipsis">{{ i.name }}</div>
          <t-dropdown trigger="click">
            <t-button theme="primary" variant="text" shape="square" size="small" class="more" @click.stop>
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item @click="onUpdateChat(i)">编辑名称</t-dropdown-item>
              <t-dropdown-item @click="onTopChat(i)">取消置顶</t-dropdown-item>
              <t-dropdown-item style="color: var(--td-error-color)" @click="onRemoveChat(i.id)">删除</t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </div>
        <div class="group">聊天</div>
        <div class="item" v-for="i in items" :key="i.id" :class="{active: activeKey === `/home/chat/0/${i.id}`}"
             @click="onClick(`/home/chat/0/${i.id}`)">
          <div class="text ellipsis">{{ i.name }}</div>
          <t-dropdown trigger="click">
            <t-button theme="primary" variant="text" shape="square" size="small" class="more" @click.stop>
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item @click="onUpdateChat(i)">编辑名称</t-dropdown-item>
              <t-dropdown-item @click="onTopChat(i)">置顶</t-dropdown-item>
              <t-dropdown-item style="color: var(--td-error-color)" @click="onRemoveChat(i.id)">删除</t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </div>
      </div>
    </div>
    <div class="home-content" :class="{collapsed}">
      <home-welcome v-if="activeKey === '/home/welcome' && show"/>
      <home-temp v-else-if="activeKey === '/home/temp' && show"/>
      <home-group v-else-if="activeKey.startsWith('/home/group/') && show"/>
      <home-chat v-else-if="activeKey.startsWith('/home/chat') && show"/>
      <empty-result v-else title="未选择项目"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ChatIcon,
  FolderIcon,
  MenuFoldIcon,
  MenuUnfoldIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon
} from "tdesign-icons-vue-next";
import {openAddAiChatGroupDialog} from "@/pages/home/modal/AddAiChatGroup";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import {useAiChatListStore} from "@/store/ai/AiChatListStore";
import {activeKey, collapsed, toggleCollapsed} from './model';
import HomeWelcome from "@/pages/home/pages/welcome/HomeWelcome.vue";
import HomeGroup from "@/pages/home/pages/group/HomeGroup.vue";
import HomeChat from "@/pages/home/pages/chat/HomeChat.vue";
import HomeTemp from "@/pages/home/pages/temp/HomeTemp.vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {AiChatList} from "@/entity/ai/AiChat";

const show = ref(true);

const groups = computed(() => useAiChatGroupStore().groups);
const items = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter(e => !e.top));
const tops = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter(e => e.top));

watch(activeKey, () => {
  show.value = false;
  nextTick(() => {
    show.value = true;
  })
})

const onClick = (path: string) => activeKey.value = path;

function onUpdateChat(data: AiChatList) {
  MessageBoxUtil.prompt("请输入新的对话名称", "编辑对话名称")
    .then(name => {
      useAiChatListStore().updateById('0', {
        id: data.id,
        name,
      })
        .then(() => MessageUtil.success("修改成功"))
        .catch(e => MessageUtil.error("修改失败", e));
    })
}

function onTopChat(data: AiChatList) {
  useAiChatListStore().updateById('0', {
    id: data.id,
    top: !data.top,
  })
    .then(() => MessageUtil.success("修改成功"))
    .catch(e => MessageUtil.error("修改失败", e));
}

function onRemoveChat(id: string) {
  MessageBoxUtil.confirm("是否删除此聊天", "删除聊天").then(() => {
    useAiChatListStore().remove('0', id)
      .then(() => {
        MessageUtil.success("删除成功");
        // 如果是当前
        if (activeKey.value === `/home/chat/0/${id}`) {
          // 变为新聊天
          activeKey.value = '/home/welcome';
        }
      })
      .catch(e => MessageUtil.error("删除失败", e));
  })
}
</script>
<style scoped lang="less">
.home {
  width: 100%;
  height: 100vh;
  background-color: var(--td-bg-color-container);

  .home-side {
    height: 100vh;
    width: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.2s ease-in-out;

    .content {
      width: 183px;
      height: calc(100% - 16px);
      padding: 8px;
      border-right: 1px solid var(--td-border-level-2-color);
      overflow: auto;
    }

    &.collapsed {
      width: 0;
      padding: 0;
    }

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

  .home-content {
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
    bottom: 0;
    transition: left 0.2s ease-in-out;

    &.collapsed {
      left: 0;
    }
  }
}
</style>
