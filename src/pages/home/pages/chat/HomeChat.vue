<template>
  <div class="home-chat">
    <div class="home-chat-collapse">
      <t-button theme="primary" variant="text" shape="square" @click="toggleCollapsed()" v-if="collapsed">
        <template #icon>
          <menu-fold-icon/>
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
      <template #content="{ item }">
        <chat-reasoning v-if="item.think?.length > 0" expand-icon-placement="right">
          <template #header>
            <chat-loading v-if="isStreamLoad" text="思考中..."/>
            <div v-else style="display: flex; align-items: center">
              <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px"/>
              <span>已深度思考</span>
            </div>
          </template>
          <chat-content v-if="item.think.length > 0" :value="item.think"/>
        </chat-reasoning>
        <chat-content v-if="item.content.length > 0" :content="item.content" :class="[item.role]"/>
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
          :textarea-props="{placeholder: '请输入消息...',}"
          @send="inputEnter"
        >
          <template #suffix>
            <t-space size="small">
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
import {
  Chat,
  ChatContent,
  ChatLoading,
  ChatReasoning,
  ChatSender,
  ChatInstanceFunctions
} from '@tdesign-vue-next/chat';
import {
  ArrowDownIcon,
  CheckCircleIcon,
  CollectionIcon,
  CopyIcon,
  DeleteIcon,
  MenuFoldIcon,
  ShareIcon
} from "tdesign-icons-vue-next";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import {activeKey, collapsed, renderModel, toggleCollapsed} from "@/pages/home/model";
import {useAiChatListStore} from "@/store/ai/AiChatListStore";
import {
  AiChatGroupWrap,
  AiChatItem,
  AiChatWrap,
  buildAiChatGroupWrap,
  transferAiChatItemToChatMessageParam
} from "@/entity/ai/AiChat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {askToAi, AskToOpenAiAbort} from "@/utils/component/ChatUtil";
import {useAiServiceStore} from "@/store";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {addNoteFromAi} from "@/pages/home/modal/addNote";

const router = useRouter();

const instance = ref<AiChatWrap>();
const group = ref<AiChatGroupWrap>(buildAiChatGroupWrap());

const text = ref('');
const model = ref('');

const chatRef = ref<ChatInstanceFunctions>();
const abort = ref<AskToOpenAiAbort>();

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
  instance.value.items.unshift({
    time: Date.now(),
    role: 'assistant',
    content: '',
    aiServiceId: item.aiServiceId,
    service: item.service,
    model: item.model
  })
  try {
    loading.value = true;
    isStreamLoad.value = true;
    await askToAi({
      messages: transferAiChatItemToChatMessageParam(items.value),
      service,
      assistant: {
        model: item.model
      },
      onAppend: (data, t) => {
        loading.value = false;
        if (!instance.value) return;
        if (t) {
          instance.value.items[0].think = data;
        } else {
          instance.value.items[0].content += data;
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
</script>
<style scoped lang="less">
.home-chat {
  position: relative;
  background-color: var(--td-bg-color-container);
  padding: 8px;

  .home-chat-collapse {
    position: absolute;
    top: 8px;
    left: 8px;
  }

  .home-chat-content {
    height: calc(100vh - 16px);
    width: 100%;
    overflow: hidden;

    .t-chat__text {
      &.user {
        border: 1px solid var(--td-border-level-2-color);
        border-radius: var(--td-radius-extraLarge);
      }

      &.assistant {
        background-color: var(--td-bg-color-secondarycontainer);
        border-radius: var(--td-radius-extraLarge);
      }

      &.model-change {
        :deep(span) {
          padding: 0 4px;
          color: var(--td-text-color-link);
        }
      }
    }
  }

  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 210px;
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
