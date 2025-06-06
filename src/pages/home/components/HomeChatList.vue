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
      v-for="i in displayItems"
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
    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!hasMore && !loading" class="no-more">没有更多了</div>
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
import { activeKey, collapsed } from "@/pages/home/model";
import ContextMenu, { MenuItem } from "@imengyu/vue3-context-menu";
import { openAddAiChatGroupDialog } from "@/pages/home/modal/AddAiChatGroup";
import {
  onRemoveChat,
  onRenameChat,
  onTopChat,
} from "@/pages/home/components/HomeContext";
import { chatMove } from "@/pages/home/components/ChatMove";

const PAGE_SIZE = 10;
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);

const list = computed(() =>
  useAiChatListStore().lists.sort((a, b) => b.createBy - a.createBy)
);
const allItems = computed<Array<AiChatList>>(() =>
  list.value.filter((e) => !e.top)
);
const tops = computed<Array<AiChatList>>(() => list.value.filter((e) => e.top));

const displayItems = computed(() => {
  return allItems.value.slice(0, page.value * PAGE_SIZE);
});

// 暴露给父组件的方法
const loadMore = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    // 模拟加载延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const totalItems = allItems.value.length;
    const currentItems = page.value * PAGE_SIZE;

    if (currentItems >= totalItems) {
      hasMore.value = false;
    } else {
      page.value++;
    }
  } finally {
    loading.value = false;
  }
};

// 重置分页状态
const resetPagination = () => {
  page.value = 1;
  hasMore.value = true;
  loading.value = false;
};

// 监听数据变化，重置分页
watch(allItems, () => {
  resetPagination();
});

// 暴露方法给父组件
defineExpose({
  loadMore,
  resetPagination,
});

const onClick = (path: string) => {
  activeKey.value = path;
  if (path !== "/home/welcome" && path !== "/home/temp") {
    // 收起
    collapsed.value = true;
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
.loading,
.no-more {
  text-align: center;
  padding: 8px;
  color: var(--td-text-color-secondary);
  font-size: 12px;
}
</style>
