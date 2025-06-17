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
      <empty-result v-if="items.length === 0" title="您已进入临时对话" tip="临时对话不会显示在历史记录中，并将被完全删除"></empty-result>
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
          :textarea-props="{placeholder: '有问题，尽管问',disabled: isStreamLoad}"
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
  ShareIcon, StopIcon
} from "tdesign-icons-vue-next";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import {collapsed, renderModel, toggleCollapsed, model} from "@/pages/home/model";
import {addNoteFromAi} from "@/pages/home/modal/addNote";
import {
  AiChatItem,
  transferAiChatItemToChatMessageParam
} from "@/entity/ai/AiChat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {askToAi, AskToOpenAiAbort} from "@/utils/component/ChatUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {useAiServiceStore} from "@/store";

const router = useRouter()

const text = ref('');

const chatRef = ref<ChatInstanceFunctions>();
const abort = shallowRef<AskToOpenAiAbort>();

const loading = ref(false);
const isStreamLoad = ref(false);
const isShowToBottom = ref(false);

const items = ref(new Array<AiChatItem>());

const disabled = computed(() => text.value.trim() === '');

// 模拟消息发送
const inputEnter = async (inputValue: string) => {
  // 清空问题
  text.value = '';
  try {
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
    items.value.unshift(item);
    const old = items.value[1];
    if (old) {
      if (old.aiServiceId !== item.aiServiceId || old.model !== item.model) {
        // 服务是否变化
        const changeService = old.service !== item.service;
        // 模型发生变化
        items.value.unshift({
          time: Date.now(),
          role: 'model-change',
          content: `模型由<span>${changeService ? old.service + ' - ' : ''}${old.model}</span>变为<span>${changeService ? item.service + ' - ' : ''}${item.model}</span>`,
          aiServiceId,
          service: service.name,
          model: m
        });
      }
    }
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
        items.value.unshift({
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
        if (!data) return;
        if (t) {
          items.value[0].think += data;
        } else {
          items.value[0].content += data;
        }
      },
      onAborted: (a) => {
        abort.value = a;
      }
    });
  } catch (e) {
    MessageUtil.error("聊天失败", e);
    items.value.unshift({
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
      }, () => MessageUtil.success("新增成功！"))
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
</script>
<style scoped lang="less">
.home-chat {
  position: relative;

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
    padding:  8px;

    :deep(.t-chat__inner) {
      width: 100%;
      max-width: 800px;
      margin: 0 auto var(--td-comp-margin-l);
    }
    :deep(.t-chat__footer) {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

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
