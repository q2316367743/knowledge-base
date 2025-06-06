<template>
  <div class="chat">
    <link :href="`./theme/${themeColor}.css`" type="text/css" rel="stylesheet"/>
    <header class="chat-header items-center justify-between pl-8px  pr-8px">
      <t-checkbox v-model="embedArticle" :disabled="editorId === 0">是否包含笔记</t-checkbox>
      <div style="overflow: hidden;">
        <chat-assistant-select v-model="assistantId" width="calc(100vw - 118px)"/>
      </div>
    </header>
    <main class="chat-main">
      <chat
        layout="single"
        style="height: calc(100vh - 57px)"
        :clear-history="chatList.length > 0 && !isStreamLoad"
        @clear="clearConfirm"
      >
        <template v-for="(item, index) in chatList" :key="index">
          <chat-item
            :name="item.name"
            :role="item.role"
            :content="item.content"
            :datetime="item.datetime"
            :text-loading="index === 0 && loading"
          >
            <template #content>
              <chat-reasoning v-if="item.reasoning" :text="item.reasoning" :think="item.think"/>
              <chat-content v-if="item.role === 'assistant'" :value="item.content" style="padding: 12px 15px;"/>
              <t-chat-content v-else :content="item.content" :role="item.role"/>
            </template>
            <template v-if="!isStreamLoad" #actions>
              <chat-action :operation-btn="['replay', 'copy']"
                           @operation="(type, { e }) => handleOperation(type, { e, index })"
              />
            </template>
          </chat-item>
        </template>
        <template #footer>
          <chat-input @send="inputEnter" @stop="onStop" :stop-disabled="isStreamLoad"/>
        </template>
      </chat>
    </main>
  </div>
</template>
<script lang="ts" setup>
import {Chat, ChatAction, ChatInput, ChatItem, ChatContent as TChatContent} from "@tdesign-vue-next/chat";
import {AiChatMessage} from "./type";
import {ChatMessageParam} from "@/types/Chat";
import {themeColor, useAiAssistantStore, useAiServiceStore, useArticleStore, useGlobalStore} from "@/store";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/modal/MessageUtil";
import {askToAi, AskToOpenAiAbort} from "@/utils/component/ChatUtil";
import {buildMessages, getCurrentTime} from "@/nested/chat/util";
import ChatAssistantSelect from "@/nested/chat/components/ChatAssistantSelect.vue";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

useGlobalStore().initDarkColors();
useAiServiceStore().init();
useAiAssistantStore().init();

const title = useTitle();

// 操作按钮加载
const loading = ref(false);
// 回答中
const isStreamLoad = ref(false);
// 是否嵌入笔记
const embedArticle = ref(false);
// 倒序渲染
const chatList = ref<Array<AiChatMessage>>([{
  name: '系统',
  role: 'system',
  content: '我有什么可以帮到您吗',
  datetime: getCurrentTime(),
}]);
const editorId = ref(0);
const assistantId = useUtoolsKvStorage(LocalNameEnum.KEY_WIDGET_CHAT_ASSISTANT, "");
const fetchCancel = shallowRef<AskToOpenAiAbort>();

let subWindow = window.preload.ipcRenderer.buildSubWindow('chat');
subWindow.receiveMsg(msg => {
  const {event, data} = msg;
  if (event === 'config') {
    const {id, name} = data;
    editorId.value = id;
    title.value = `AI问答「${name}」`;
  }
});

const clearConfirm = () => chatList.value = [{
  name: '系统',
  role: 'system',
  content: '我有什么可以帮到您吗',
  datetime: getCurrentTime(),
}];

function inputEnter(value: string) {
  if (isStreamLoad.value) {
    return MessageUtil.error("请等待上一次请求结束");
  }
  const {aiAssistantMap} = useAiAssistantStore();
  const {aiServiceMap} = useAiServiceStore();
  const assistant = aiAssistantMap.get(assistantId.value);
  if (!assistant) {
    return MessageUtil.error("AI 助手未找到");
  }
  const service = aiServiceMap.get(assistant.aiServiceId);
  if (!service) {
    return MessageUtil.error("AI 服务未找到");
  }

  // 获取上一个
  const oldAssistantId = chatList.value[0]?.assistantId;
  if (oldAssistantId) {
    if (oldAssistantId !== assistantId.value) {
      // 加入换模型
      chatList.value.unshift({
        role: 'model-change',
        content: `模型由 <span>${aiAssistantMap.get(oldAssistantId)?.name}</span> 变为 <span>${aiAssistantMap.get(assistantId.value)?.name}</span>`,
        datetime: getCurrentTime(),
        assistantId: assistantId.value
      })
    }
  }


  chatList.value.unshift({
    role: 'user',
    content: value,
    name: InjectionUtil.getUser()?.nickname || '用户',
    datetime: getCurrentTime(),
    assistantId: assistantId.value
  });
  isStreamLoad.value = true;
  loading.value = true;
  chatList.value.unshift({
    role: 'assistant',
    // 模型
    name: aiAssistantMap.get(assistantId.value)?.name || 'AI 助理',
    content: '',
    datetime: getCurrentTime(),
    assistantId: assistantId.value
  });
  // 异步处理
  (async () => {
    const messages: Array<ChatMessageParam> = [{
      role: 'system',
      content: assistant.system
    }];
    if (embedArticle.value) {
      // 嵌入笔记
      if (editorId.value) {
        const content = await useArticleStore().getContent(editorId.value);
        messages.push({
          role: 'system',
          content: `根据以下文件内容回答问题：\n${typeof content.record === 'object' ? JSON.stringify(content.record) : content.record}`
        })
      } else {
        MessageUtil.warning("系统异常，笔记ID不存在，无法嵌入");
      }
    }
    messages.push(...buildMessages(chatList.value))

    await askToAi({
      service,
      assistant,
      messages,
      onAppend: (content, t) => {
        chatList.value[0].think = t;
        if (t) {
          chatList.value[0].reasoning += content;
        } else {
          chatList.value[0].content += content;
        }
        loading.value = false;
      },
      onAborted: (abort) => {
        fetchCancel.value = abort;
      }
    })

  })()
    .catch(e => { // 注意错误类型是否为中断
      if (e.name === "AbortError") {
        chatList.value[0].content += "\n\n求被手动终止！";
      } else {
        MessageUtil.error("获取结果失败", e);
        chatList.value.unshift({
          role: 'error',
          name: '系统',
          content: `${e}`,
          datetime: getCurrentTime(),
          assistantId: assistantId.value
        })
      }
    }).finally(() => {
    isStreamLoad.value = false;
    loading.value = false;
    fetchCancel.value = undefined;
  })
}

function onStop() {
  if (fetchCancel.value) {
    fetchCancel.value.abort();
  }

}

function handleOperation(type: string, e: { e: Error, index: number }) {
  if (type === 'copy') {
    InjectionUtil.copyText(chatList.value[e.index].content);
  } else if (type === 'replay') {
    if (isStreamLoad.value) return MessageUtil.error("正在回答中，请稍候");
    chatList.value.shift();
    const q = chatList.value.shift();
    if (q && q.role === 'user') {
      inputEnter(q.content);
    }
  }
}
</script>
<style scoped lang="less">
.chat {
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .chat-header {
    height: 40px;
    border-bottom: 1px solid var(--td-border-level-1-color);
    display: flex;
    align-items: center;
  }

  .chat-main {
    height: calc(100vh - 50px);
    margin-top: 9px;
    width: 100%;

    :deep(.model-change) {
      margin-left: 8px;
      margin-right: 8px;
    }

    :deep(.t-chat__footer) {
      padding: 0 8px;
    }

    :deep(.t-chat__detail) {
      max-width: 100% !important;
    }
  }
}
</style>
