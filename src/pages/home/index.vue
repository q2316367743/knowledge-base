<template>
  <div class="home">
    <div class="home-side" :class="{collapsed}">
      <div class="header">
        <div class="flex justify-between items-center mb-12px">
          <div style="font-weight: bold;font-size: var(--td-font-size-title-large)">问一问</div>
          <t-space size="small">
            <t-button theme="primary" variant="text" shape="square" @click="openHomeChatSearch()">
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
                  <chat-checked-icon v-if="activeKey === '/home/temp'"/>
                  <chat-icon v-else/>
                </template>
              </t-button>
            </t-tooltip>
          </t-col>
        </t-row>
      </div>
      <div class="content">
        <div class="group first">
          <div>分组</div>
          <t-button theme="primary" variant="text" shape="square" size="small" @click="openAddAiChatGroupDialog">
            <template #icon>
              <plus-icon/>
            </template>
          </t-button>
        </div>
        <div class="group-list" ref="groupList">
          <div class="item" v-for="g in groups" :key="g.id" :class="{active: activeKey === `/home/group/${g.id}`}"
               @click="onClick(`/home/group/${g.id}`)">
            <folder-icon class="folder-icon"/>
            <div class="text ellipsis">{{ g.name }}</div>
            <t-button theme="primary" variant="text" shape="square" size="small" class="more"
                      @click.stop="onGroupMenuClick(g, $event)">
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
          </div>
        </div>
        <div class="group" v-if="tops.length > 0">置顶</div>
        <div class="item" v-for="i in tops" :key="i.id" :class="{active: activeKey === `/home/chat/0/${i.id}`}"
             @click="onClick(`/home/chat/0/${i.id}`)">
          <div class="text ellipsis">{{ i.name }}</div>
          <t-button theme="primary" variant="text" shape="square" size="small" class="more"
                    @click.stop="onChatMenuClick(i, $event)">
            <template #icon>
              <more-icon/>
            </template>
          </t-button>
        </div>
        <div class="group">聊天</div>
        <div class="item" v-for="i in items" :key="i.id" :class="{active: activeKey === `/home/chat/0/${i.id}`}"
             @click="onClick(`/home/chat/0/${i.id}`)">
          <div class="text ellipsis">{{ i.name }}</div>
          <t-button theme="primary" variant="text" shape="square" size="small" class="more"
                    @click.stop="onChatMenuClick(i, $event)">
            <template #icon>
              <more-icon/>
            </template>
          </t-button>
        </div>
      </div>
    </div>
    <div class="home-content" :class="{collapsed}">
      <home-temp v-if="activeKey === '/home/temp' && show"/>
      <home-group v-else-if="activeKey.startsWith('/home/group/') && show"/>
      <home-chat v-else-if="activeKey.startsWith('/home/chat') && show"/>
      <home-welcome v-else/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ChatCheckedIcon,
  ChatIcon,
  FolderIcon,
  MenuFoldIcon,
  MenuUnfoldIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon
} from "tdesign-icons-vue-next";
import ContextMenu, {MenuItem} from '@imengyu/vue3-context-menu';
import {useSortable, moveArrayElement} from "@vueuse/integrations/useSortable";
import {openAddAiChatGroupDialog} from "@/pages/home/modal/AddAiChatGroup";
import {useAiChatGroupStore, useAiChatListStore, useGlobalStore} from "@/store";
import {activeKey, collapsed, toggleCollapsed} from './model';
import {AiChatGroup, AiChatList} from "@/entity/ai/AiChat";
import {onRemoveChat, onTopChat, onRenameChat, onRenameGroup, onRemoveGroup} from "@/pages/home/components/HomeContext";
import HomeWelcome from "@/pages/home/pages/welcome/HomeWelcome.vue";
import HomeGroup from "@/pages/home/pages/group/HomeGroup.vue";
import HomeChat from "@/pages/home/pages/chat/HomeChat.vue";
import HomeTemp from "@/pages/home/pages/temp/HomeTemp.vue";
import {openHomeChatSearch} from "@/pages/home/components/HomeChatSearch";

const show = ref(true);
const groupList = ref<HTMLDivElement>();

const groups = computed(() => useAiChatGroupStore().groups);
const items = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter(e => !e.top));
const tops = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter(e => e.top));

watch(activeKey, () => {
  show.value = false;
  nextTick(() => {
    show.value = true;
  })
})

useSortable(groupList, groups, {
  animation: 300,
  onUpdate: (event) => {
    const {oldIndex, newIndex} = event;
    if (typeof oldIndex !== "number" || typeof newIndex !== "number") return;
    const g = Array.from(groups.value);
    moveArrayElement(g, oldIndex, newIndex);
    useAiChatGroupStore().sort(g);
  }
})

const onClick = (path: string) => {
  activeKey.value = path;
  if (path !== '/home/welcome' && path !== '/home/temp') {
    // 收起
    collapsed.value = true;
  }
}

const onChatMenuClick = (data: AiChatList, e: MouseEvent) => {
  const {groups} = useAiChatGroupStore();
  const items = new Array<MenuItem>();
  groups.forEach(group => {
    items.push({
      label: group.name,
    });
  });
  if (items.length > 0) {
    items.push({divided: 'self'});
  }
  items.push({
    label: '新建分组', icon: () => h(PlusIcon, {
      style: {
        marginRight: '10px',
      }
    })
  })
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items: [{
      label: '移动到分组',
      children: items
    }, {
      label: '编辑名称',
      onClick: () => onRenameChat('0', data)
    }, {
      label: data.top ? '取消置顶' : '置顶',
      onClick: () => onTopChat('0', data)
    }, {
      label: () => h('span', {
        style: {
          color: 'var(--td-error-color)'
        }
      }, '删除'),
      onClick: () => onRemoveChat('0', data.id, () => {
        if (activeKey.value === `/home/chat/0/${data.id}`) activeKey.value = '';
      })
    }]
  })
}

const onGroupMenuClick = (group: AiChatGroup, e: MouseEvent) => {
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? 'default dark' : 'default',
    items: [{
      label: '编辑名称',
      onClick: () => onRenameGroup(group),
    }, {
      label: () => h('span', {
        style: {
          color: 'var(--td-error-color)'
        }
      }, '删除'),
      onClick: () => onRemoveGroup(group.id, () => {
        if (activeKey.value === `/home/group/${group.id}`) activeKey.value = '';
      })
    }]
  });
}

// TODO: 1. 对话框改为tsx，2. 左侧要无线滚动，3. 聊天排序要倒叙
</script>
<style scoped lang="less">
.home {
  width: 100%;
  height: 100vh;
  background-color: var(--td-bg-color-container);

  .home-side {
    height: 100vh;
    width: 199px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width 0.2s ease-in-out;
    border-right: 1px solid var(--td-border-level-2-color);


    .header {
      padding: 8px 8px 0;
      width: 183px;
    }

    .content {
      width: 183px;
      height: calc(100% - 100px);
      padding: 8px;
      overflow: auto;
    }

    &.collapsed {
      width: 0;
      padding: 0;
      border-color: transparent;
    }

    .group {
      user-select: none;
      color: var(--td-text-color-secondary);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 4px 0;
      padding: 8px 8px 0;
      &.first {
        margin-top: 0;
      }
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
