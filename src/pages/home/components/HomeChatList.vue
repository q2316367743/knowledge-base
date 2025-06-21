<template>
  <div>
    <div class="group" v-if="tops.length > 0">置顶</div>
    <div
      class="item"
      v-for="i in tops"
      :key="i.id"
      :class="{ active: activeKey === `/home/chat/0/${i.id}` }"
      @click="onClick(`/home/chat/0/${i.id}`)"
      @contextmenu="onChatMenuClick(i, $event)"
    >
      <div class="text ellipsis">{{ i.name }}</div>
      <t-button
        theme="primary"
        variant="text"
        shape="square"
        size="small"
        class="more"
        @click.stop="onChatMenuClick(i, $event)"
      >
        <template #icon>
          <more-icon />
        </template>
      </t-button>
    </div>
    <div class="group">聊天</div>
    <div
      class="item"
      v-for="i in allItems"
      :key="i.id"
      :class="{ active: activeKey === `/home/chat/0/${i.id}` }"
      @click="onClick(`/home/chat/0/${i.id}`)"
      @contextmenu="onChatMenuClick(i, $event)"
    >
      <div class="text ellipsis">{{ i.name }}</div>
      <t-button
        theme="primary"
        variant="text"
        shape="square"
        size="small"
        class="more"
        @click.stop="onChatMenuClick(i, $event)"
      >
        <template #icon>
          <more-icon />
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { FolderIcon, MoreIcon, PlusIcon } from "tdesign-icons-vue-next";
import { AiChatList } from "@/entity/ai/AiChat";
import {
  useAiChatGroupStore,
  useAiChatListStore,
  useGlobalStore,
} from "@/store";
import {activeKey, autoHideCollapsed} from "@/pages/home/model";
import ContextMenu, { MenuItem } from "@imengyu/vue3-context-menu";
import { openAddAiChatGroupDialog } from "@/pages/home/modal/AddAiChatGroup";
import {
  onRemoveChat,
  onRenameChat,
  onTopChat,
} from "@/pages/home/components/HomeContext";
import { chatMove } from "@/pages/home/components/ChatMove";

const allItems = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter((e) => !e.top));
const tops = computed<Array<AiChatList>>(() => useAiChatListStore().lists.filter((e) => e.top));


const onClick = (path: string) => {
  activeKey.value = path;
  if (path !== "/home/welcome" && path !== "/home/temp") {
    // 收起
    autoHideCollapsed()
  }
};

const onChatMenuClick = (data: AiChatList, e: MouseEvent) => {
  const { groups } = useAiChatGroupStore();
  const items = new Array<MenuItem>();
  groups.forEach((group) => {
    items.push({
      label: group.name,
      icon: () => h(FolderIcon),
      onClick: () => onMove(data, group.id),
    });
  });
  if (items.length > 0) {
    items.push({ divided: "self" });
  }
  items.push({
    label: "新建分组",
    icon: () => h(PlusIcon),
    onClick: () => openAddAiChatGroupDialog(),
  });
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? "default dark" : "default",
    items: [
      {
        label: "移动到分组",
        children: items,
      },
      {
        label: "编辑名称",
        onClick: () => onRenameChat("0", data),
      },
      {
        label: data.top ? "取消置顶" : "置顶",
        onClick: () => onTopChat("0", data),
      },
      {
        label: () =>
          h(
            "span",
            {
              style: {
                color: "var(--td-error-color)",
              },
            },
            "删除"
          ),
        onClick: () =>
          onRemoveChat("0", data.id, () => {
            if (activeKey.value === `/home/chat/0/${data.id}`)
              activeKey.value = "";
          }),
      },
    ],
  });
};

function onMove(chat: AiChatList, targetGroupId: string) {
  chatMove({
    chatId: chat.id,
    fromGroupId: "0",
    targetGroupId,
  });
}
</script>
<style scoped lang="less">
</style>
