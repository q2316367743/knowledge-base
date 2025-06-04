<template>
  <div class="home-group-content" v-if="group">
    <div class="home-group-content-title">
      <div class="home-group-content-title-left">
        <div class="home-group-content-title-left-icon">
          <folder-icon size="32px"/>
        </div>
        <div class="home-group-content-title-left-name">
          {{ group.name }}
        </div>
      </div>
      <div class="home-group-content-title-right">
        <t-space size="small">
          <t-input placeholder="搜索组内对话" v-model="keyword">
            <template #prefix-icon>
              <search-icon/>
            </template>
          </t-input>
          <t-dropdown trigger="click">
            <t-button theme="primary" shape="square">
              <template #icon>
                <more-icon/>
              </template>
            </t-button>
            <t-dropdown-menu>
              <t-dropdown-item @click="onRenameGroup(group, initGroup)">编辑名称</t-dropdown-item>
              <t-dropdown-item @click="onDelete" style="color: var(--td-error-color)">删除分组</t-dropdown-item>
            </t-dropdown-menu>
          </t-dropdown>
        </t-space>
      </div>
    </div>
    <t-row :gutter="16">
      <t-col flex="auto">
        <div class="home-group-content-prompt" @click="onUpdatePrompt">
          <div class="main">
            <div class="home-group-content-prompt__title">{{ hasPrompt ? "工作指令" : "添加指令" }}</div>
            <div class="home-group-content-prompt__content ellipsis" v-if="hasPrompt">{{ group.prompt }}</div>
            <div class="home-group-content-prompt__placeholder" v-else>定制问一问在该分组的回答方式</div>
          </div>
          <div class="icon">
            <chevron-right-icon size="20px" class="mt-15px"/>
          </div>
        </div>
      </t-col>
      <t-col flex="72px" v-if="!hasPrompt" class="home-group-content-prompt center" @click="onUpdatePrompt1()">
        指令库
      </t-col>
    </t-row>
    <div class="chat-title">
      <span>对话 · </span>
      <span>{{ chats.length }}</span>
    </div>
    <div class="chat-list">
      <div class="chat-item" v-for="{item} in results" :key="item.id" @click="onChatClick(item)"
           @contextmenu="onChatContextMenuClick(item, $event)">
        <div class="left">
          <chat-double-icon size="16px" />
          <div class="title">{{ item.name }}</div>
        </div>
        <div class="right">
          {{ toDateTimeString(item.createBy) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ChatDoubleIcon,
  ChevronRightIcon,
  FolderIcon,
  MinusIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon
} from "tdesign-icons-vue-next";
import {useFuse} from "@vueuse/integrations/useFuse";
import ContextMenu, {MenuItem} from '@imengyu/vue3-context-menu'
import {useAiChatGroupStore, useAiChatListStore, useGlobalStore} from "@/store";
import {AiChatList, buildAiChatGroupWrap} from "@/entity/ai/AiChat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {openAiGroupPrompt, openPrompt} from "@/pages/home/modal/AiGroupPrompt";
import {activeKey} from "@/pages/home/model";
import {onRemoveChat, onRemoveGroup, onRenameChat, onRenameGroup} from "@/pages/home/components/HomeContext";

const props = defineProps({
  groupId: {
    type: String,
    default: '0'
  }
});

const keyword = ref('');
const group = ref(buildAiChatGroupWrap());
const chats = ref(new Array<AiChatList>());
const rev = ref<string>();

const {results} = useFuse(keyword, chats, {
  matchAllWhenSearchEmpty: true,
  fuseOptions: {
    keys: ['name', 'prompt'],
    includeScore: true,
    threshold: 0.3,
  }
})

const hasPrompt = computed(() => !!group.value.prompt);

const initGroup = () => {
  useAiChatGroupStore().getById(props.groupId)
    .then(g => group.value = g)
    .catch(e => MessageUtil.error("获取分组详情失败", e));
}
const initChats = () => {
  useAiChatListStore().listBy(props.groupId)
    .then(d => {
      chats.value = d.list;
      rev.value = d.rev;
    })
    .catch(e => MessageUtil.error("获取分组对话失败", e));
}

onMounted(() => {
  // 获取分组详情
  initGroup();
  // 获取分组对话
  initChats();
});

const onUpdatePrompt = () => {
  openAiGroupPrompt(group.value)
    .then(prompt => {
      useAiChatGroupStore().updatePromptById(group.value.id, prompt, group.value.rev)
        .then(rev => {
          group.value.rev = rev;
          group.value.prompt = prompt;
          MessageUtil.success("更新指令成功");
        })
        .catch(e => MessageUtil.error("更新指令失败", e));
    })
}
const onUpdatePrompt1 = () => {
  openPrompt()
    .then(prompt => {
      useAiChatGroupStore().updatePromptById(group.value.id, prompt, group.value.rev)
        .then(rev => {
          group.value.rev = rev;
          group.value.prompt = prompt;
          MessageUtil.success("更新指令成功");
        })
        .catch(e => MessageUtil.error("更新指令失败", e));
    })
}

function onChatClick(data: AiChatList) {
  activeKey.value = `/home/chat/${props.groupId}/${data.id}`
}

function onChatContextMenuClick(data: AiChatList, e: MouseEvent) {
  const g: Array<MenuItem> = useAiChatGroupStore().groups.filter(e => e.id !== props.groupId).map(e => {
    return {
      label: e.name,
    }
  });
  if (g.length > 0) {
    g.push({
      divided: true,
    })
  }
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? "default dark" : "default",
    zIndex: 200,
    items: [{
      label: '移动到',
      children: [
        ...g, {
          label: "移出本组",
          icon: () => h(MinusIcon)
        }, {
          label: '新建分组',
          icon: () => h(PlusIcon)
        }]
    }, {
      label: '编辑名称',
      onClick() {
        onRenameChat(props.groupId,  data, () => {
          // 重新初始化
          initChats();
        })
      }
    }, {
      label: () => h('span', {
        style: {
          color: 'var(--td-error-color)'
        },
      }, "删除"),
      onClick() {
        onRemoveChat(props.groupId, data.id,() => {
          // 重新初始化
          initChats();
        })
      }
    }]
  })
}

function onDelete() {
  onRemoveGroup(props.groupId, () => {
    activeKey.value = "/home/welcome";
  })
}
</script>
<style scoped lang="less">
.home-group-content {
  max-width: 752px;
  padding: 0 24px;
  margin: 0 auto;

  .home-group-content-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .home-group-content-title-left {
      display: flex;
      align-items: center;

      .home-group-content-title-left-name {
        font-size: var(--td-font-size-title-large);
        margin-left: 8px;
      }
    }
  }

  .home-group-content-prompt {
    padding: 12px 16px;
    background-color: var(--td-bg-color-component);
    border-radius: var(--td-radius-medium);
    cursor: pointer;
    transition: all .2s;
    display: flex;

    &:hover {
      background-color: var(--td-bg-color-component-hover);
    }

    &:active {
      background-color: var(--td-bg-color-component-active);
    }

    &.center {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 74px;
    }

    .main {
      width: calc(100% - 48px);
    }

    .icon {
      width: 32px;
      margin-left: 16px;
    }


    .home-group-content-prompt__title {
      font-size: var(--td-font-size-body-large);
    }

    .home-group-content-prompt__content {
      font-size: var(--td-font-size-body-medium);
      margin-top: 6px;
    }

    .home-group-content-prompt__placeholder {
      font-size: var(--td-font-size-body-medium);
      color: var(--td-text-color-placeholder);
      margin-top: 6px;
    }
  }

  .chat-title {
    color: var(--td-text-color-placeholder);
    font-size: var(--td-font-size-title-small);
    margin-top: 24px;
    margin-left: 12px;

    .number {
      font-weight: bold;
    }
  }

  .chat-list {
    margin-top: 8px;

    .chat-item {
      padding: 12px 16px;
      background-color: var(--td-bg-color-container);
      border-radius: var(--td-radius-medium);
      transition: background-color 0.3s ease-in-out;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }

      .left {
        display: flex;
        align-items: center;

        .title {
          font-weight: bold;
          margin-left: 8px;
        }
      }

    }
  }

}
</style>
