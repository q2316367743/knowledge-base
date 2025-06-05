<template>
  <div class="home-chat">
    <div class="home-chat-collapse">
      <t-button theme="primary" variant="text" shape="square" @click="toggleCollapsed()" v-if="collapsed">
        <template #icon>
          <menu-fold-icon/>
        </template>
      </t-button>
      <t-divider layout="vertical" v-if="collapsed"/>
      <div class="breadcrumb group" v-if="group.id !== '0'" @click="handleGroup">{{ group.name }}</div>
      <div class="divider" v-if="group.id !== '0'">/</div>
      <t-dropdown trigger="click">
        <div class="breadcrumb">
          <span class="text">{{ instance?.name }}</span>
          <chevron-down-icon class="icon"/>
        </div>
        <t-dropdown-menu>
          <t-dropdown-item @click="handleUpdate">编辑名称</t-dropdown-item>
          <t-dropdown-item style="color: var(--td-error-color)" @click="handleRemove">删除对话</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
      <t-button theme="primary" variant="text" shape="square" style="margin-left: auto;margin-right: 4px;"
                @click="handleSave()">
        <template #icon>
          <save-icon/>
        </template>
      </t-button>
    </div>
    <chat
      ref="chatRef"
      :data="items"
      :clear-history="false"
      :text-loading="loading"
      :is-stream-load="isStreamLoad"
      class="home-chat-content"
      @scroll="handleChatScroll"
    >
      <template #content="{ item, index }">
        <chat-reasoning v-if="item.think && item.think.length > 0" expand-icon-placement="right">
          <template #header>
            <chat-loading v-if="isStreamLoad && index === 0" text="思考中..."/>
            <div v-else style="display: flex; align-items: center">
              <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px"/>
              <span>已深度思考</span>
            </div>
          </template>
          <chat-content :content="item.think"/>
        </chat-reasoning>
        <chat-content v-if="item.content.length > 0" :content="item.content" :class="[item.role]" class="typo"/>
      </template>
      <template #actions="{ item, index }">
        <t-space size="small" class="mt-8px" style="margin-left: -16px">
          <t-tooltip content="复制">
            <t-button theme="primary" variant="text" shape="square" size="small"
                      @click="handleOperator('copy', item, index)">
              <template #icon>
                <copy-icon/>
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip content="收藏">
            <t-button theme="primary" variant="text" shape="square" size="small"
                      @click="handleOperator('coll', item, index)">
              <template #icon>
                <collection-icon/>
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip content="删除">
            <t-button theme="danger" variant="text" shape="square" size="small"
                      @click="handleOperator('delete', item, index)">
              <template #icon>
                <delete-icon/>
              </template>
            </t-button>
          </t-tooltip>
          <t-tooltip content="分享">
            <t-button theme="primary" variant="text" shape="square" size="small"
                      @click="handleOperator('share', item, index)">
              <template #icon>
                <share-icon/>
              </template>
            </t-button>
          </t-tooltip>
        </t-space>
      </template>
      <template #footer>
        <chat-sender
          v-model="text"
          class="chat-sender"
          :textarea-props="{placeholder: '请输入消息...',disabled: isStreamLoad}"
          @send="inputEnter"
        >
          <template #suffix>
            <t-button theme="danger" shape="circle" v-if="isStreamLoad" @click="handleStop">
              <template #icon>
                <stop-icon/>
              </template>
            </t-button>
            <t-space size="small" v-else>
              <t-button variant="outline" shape="round" :disabled @click="onClear">
                <template #icon>
                  <delete-icon/>
                </template>
                清空输入
              </t-button>
              <t-button shape="round" :disabled @click="onSend">发送</t-button>
            </t-space>
          </template>
          <template #prefix>
            <home-assistant-select v-model="model"/>
          </template>
        </chat-sender>
      </template>
    </chat>
    <t-button v-if="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
      <arrow-down-icon/>
    </t-button>
  </div>
</template>
<script lang="ts" setup>
import {Chat, ChatContent, ChatInstanceFunctions, ChatLoading, ChatReasoning, ChatSender} from '@tdesign-vue-next/chat';
import {
  ArrowDownIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CollectionIcon,
  CopyIcon,
  DeleteIcon,
  MenuFoldIcon,
  SaveIcon,
  ShareIcon,
  StopIcon
} from "tdesign-icons-vue-next";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import {activeKey, collapsed, renderModel, toggleCollapsed} from "@/pages/home/model";
import {addNoteFromAi} from "@/pages/home/modal/addNote";
import {onRemoveChat, onRenameChat} from "@/pages/home/components/HomeContext";
import {useAiChatGroupStore, useAiChatListStore, useAiServiceStore} from "@/store";
import {
  AiChatGroupWrap,
  AiChatItem,
  AiChatWrap,
  buildAiChatGroupWrap,
  transferAiChatItemToChatMessageParam
} from "@/entity/ai/AiChat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {askToAi, AskToOpenAiAbort} from "@/utils/component/ChatUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {addArticleModal} from "@/pages/note/components/he-context";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";

const router = useRouter();

const instance = ref<AiChatWrap>();
const group = ref<AiChatGroupWrap>(buildAiChatGroupWrap());

const text = ref('');
const model = ref('');

const chatRef = ref<ChatInstanceFunctions>();
const abort = shallowRef<AskToOpenAiAbort>();

const loading = ref(false);
const isStreamLoad = ref(false);
const isShowToBottom = ref(false);

onMounted(() => {
  useAiChatListStore().getInstance(activeKey.value)
    .then(i => {
      instance.value = i;
      // 模型是最后一个
      model.value = `${i.items[0].aiServiceId}/${i.items[0].model}`;
      // 获取所在组
      useAiChatGroupStore()
        .getById(i.groupId)
        .then(g => group.value = g)
        .finally(() => {
          // 如果最后一个是user，则继续
          if (i.items.length > 0 && i.items[0].role === 'user') {
            onAsk(i.items[0])
              .catch(e => MessageUtil.error("聊天失败", e));
          }
        });
    })
    .catch(e => MessageUtil.error("获取聊天失败", e));
});

const items = computed<Array<AiChatItem>>(() => instance.value?.items || []);

const disabled = computed(() => text.value.trim() === '');

// 保存内容
const onSaveContent = async () => {
  if (!instance.value) return;
  instance.value.rev = await useAiChatListStore().saveContent(instance.value.id, {
    references: instance.value.references,
    items: instance.value.items
  }, instance.value.rev)
}
// 模拟消息发送
const inputEnter = async (inputValue: string) => {
  // 清空问题
  text.value = '';
  try {
    if (!instance.value) return Promise.reject("AI 聊天实例不存在");
    const {aiServiceId, model: m} = renderModel(model.value);
    const service = useAiServiceStore().aiServiceMap.get(aiServiceId);
    if (!service) return Promise.reject(new Error("AI 服务不存在"));
    const item: AiChatItem = {
      time: Date.now(),
      role: 'user',
      content: inputValue,
      aiServiceId,
      service: service.name,
      model: m
    };
    instance.value.items.unshift(item);
    const old = instance.value.items[1];
    if (old) {
      if (old.aiServiceId !== item.aiServiceId || old.model !== item.model) {
        // 服务是否变化
        const changeService = old.service !== item.service;
        // 模型发生变化
        instance.value.items.unshift({
          time: Date.now(),
          role: 'model-change',
          content: `模型由<span>${changeService ? old.service + ' - ' : ''}${old.model}</span>变为<span>${changeService ? item.service + ' - ' : ''}${item.model}</span>`,
          aiServiceId,
          service: service.name,
          model: m
        });
      }
    }
    // 保存内容
    await onSaveContent();
    // 提问
    await onAsk(item);
  } catch (e) {
    MessageUtil.error("提问失败", e);
  }
}
const onClear = () => text.value = '';
const onSend = () => {
  if (disabled.value) {
    return;
  }
  inputEnter(text.value);
  text.value = '';
};

async function onAsk(item: AiChatItem) {
  if (!instance.value) return Promise.reject(new Error("聊天实例不存在"));
  const service = useAiServiceStore().aiServiceMap.get(item.aiServiceId);
  if (!service) return Promise.reject(new Error("AI 服务不存在"));
  abort.value = undefined;
  try {
    loading.value = true;
    isStreamLoad.value = true;
    await askToAi({
      messages: transferAiChatItemToChatMessageParam(items.value),
      service,
      assistant: {
        model: item.model
      },
      onStart: () => {
        if (!instance.value) return;
        instance.value.items.unshift({
          time: Date.now(),
          role: 'assistant',
          content: '',
          aiServiceId: item.aiServiceId,
          service: item.service,
          model: item.model,
          think: ''
        });
      },
      onAppend: (data, t) => {
        loading.value = false;
        if (!instance.value) return;
        if (!data) return;
        if (t) {
          instance.value.items[0].think += data;
        } else {
          instance.value.items[0].content += data;
          isStreamLoad.value = false;
        }
      },
      onAborted: (a) => {
        abort.value = a;
      }
    });
  } catch (e) {
    MessageUtil.error("聊天失败", e);
    instance.value.items.unshift({
      time: Date.now(),
      role: 'error',
      content: '请求出错！原因：' + (e instanceof Error ? e.message : `${e}`),
      aiServiceId: item.aiServiceId,
      service: item.service,
      model: item.model
    })
  } finally {
    loading.value = false;
    isStreamLoad.value = false;
    // 保存
    await onSaveContent();
  }
}

// 是否显示回到底部按钮
const handleChatScroll = function (context: any) {
  const {e} = context;
  const scrollTop = (e.target as HTMLDivElement)?.scrollTop || 0;
  isShowToBottom.value = scrollTop < 0;
};
// 滚动到底部
const backBottom = () => {
  chatRef.value?.scrollToBottom?.({
    behavior: 'smooth',
  });
};
// 复制
const handleOperator = (op: string, item: AiChatItem, index: number) => {
  switch (op) {
    case 'copy':
      return InjectionUtil.copyText(item.content)
    case 'coll':
      // 寻找问题
      let q = '';
      while (true) {
        index += 1;
        const old = items.value[index];
        if (!old) break;
        if (old.role === 'user') {
          q = old.content;
          break;
        }
      }
      addNoteFromAi({
        id: item.time,
        q,
        t: item.think || '',
        a: item.content
      }, () => {
        MessageUtil.success("新增成功！");
        router.push('/note');
      })
      break;
    case 'delete':
      break;
    case 'share':
      break;
  }
}
// 停止
const handleStop = () => {
  console.log(isStreamLoad.value, abort.value);
  if (!isStreamLoad.value) return;
  if (!abort.value) return;
  abort.value.abort("用户主动停止");
}
const handleUpdate = () => {
  if (!instance.value) return MessageUtil.error("对话实例不存在");
  onRenameChat(instance.value.groupId, instance.value, name => {
    instance.value!.name = name;
  });
}
const handleRemove = () => {
  if (!instance.value) return MessageUtil.error("对话实例不存在");
  onRemoveChat(instance.value.groupId, instance.value.id);
}
const handleGroup = () => {
  activeKey.value = `/home/group/${group.value.id}`;
}
const handleSave = () => {
  addArticleModal({
    sourceName: instance.value?.name,
    content: instance.value,
    showTypeRadio: false,
    defaultType: ArticleTypeEnum.AI_CHAT,
    onSuccess: () => {
      MessageUtil.success("新增成功");
      router.push('/note');
    }
  });
}
</script>
<style scoped lang="less">
.home-chat {
  position: relative;
  background-color: var(--td-bg-color-container);

  .home-chat-collapse {
    display: flex;
    align-items: center;
    height: 32px;
    border-bottom: 1px solid var(--td-border-level-2-color);
    padding: 4px;

    .divider {
      margin: 0 8px;
    }

    .breadcrumb {
      user-select: none;
      cursor: pointer;
      border-radius: var(--td-radius-default);
      transition: background-color 0.3s ease-in-out;
      padding: 4px 8px;

      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }

      &:active {
        background-color: var(--td-bg-color-container-active);
      }

      &.group {
        color: var(--td-text-color-secondary);
      }

      .icon {
        margin-left: 4px;
      }
    }
  }

  .home-chat-content {
    height: calc(100vh - 41px);
    width: 100%;
    overflow: hidden;
    padding: 8px;
  }

  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 160px;
    padding: 0;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.08), 0px 16px 24px 2px rgba(0, 0, 0, 0.04),
    0px 6px 30px 5px rgba(0, 0, 0, 0.05);
    background-color: var(--td-bg-color-container);
  }

}
</style>
