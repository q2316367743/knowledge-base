<template>
  <div class="chat">
    <header class="chat-header items-center justify-between pl-8px  pr-8px">
      <a-checkbox v-model="embedArticle">是否将文章作为上下文</a-checkbox>
      <home-assistant-select v-model="assistantId"/>
    </header>
    <main class="chat-main">
      <t-chat
        layout="single"
        style="height: calc(100vh - 57px)"
        :clear-history="chatList.length > 0 && !isStreamLoad"
        @clear="clearConfirm"
      >
        <template v-for="(item, index) in chatList" :key="index">
          <t-chat-item
            :name="item.name"
            :role="item.role"
            :content="item.content"
            :datetime="item.datetime"
            :text-loading="index === 0 && loading"
          >
            <template v-if="!isStreamLoad" #actions>
              <t-chat-action
                :content="item.content"
                @operation="(type, { e }) => handleOperation(type, { e, index })"
              />
            </template>
          </t-chat-item>
        </template>
        <template #footer>
          <t-chat-input @send="inputEnter" @stop="onStop" :stop-disabled="isStreamLoad" />
        </template>
      </t-chat>
    </main>
  </div>
</template>
<script lang="ts" setup>
import OpenAI from "openai";
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatItem as TChatItem,
  ChatInput as TChatInput,
} from '@tdesign-vue-next/chat';
import {AiChatMessage} from "./type";
import {useGlobalStore} from "@/store/GlobalStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {buildMessages, getCurrentTime} from "@/nested/chat/util";
import HomeAssistantSelect from "@/pages/home/components/HomeAssistantSelect.vue";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {copyText} from "@/utils/utools/NativeUtil";

useGlobalStore().initDarkColors();
useAiServiceStore().init();
useAiAssistantStore().init();

const title = useTitle();

// 操作按钮加载
const loading = ref(false);
// 回答中
const isStreamLoad = ref(false);
// 是否嵌入文章
const embedArticle = ref(false);
// 倒序渲染
const chatList = ref<Array<AiChatMessage>>([{
  name: '系统',
  role: 'system',
  content: '我有什么可以帮到您吗',
  datetime: getCurrentTime(),
}]);
const editorId = ref(0);
const assistantId = useUtoolsKvStorage(LocalNameEnum.KEY_EDITOR_ASSISTANT, "");

let subWindow = window.preload.ipcRenderer.buildSubWindow('chat');
subWindow.receiveMsg(msg => {
  const {type, value} = msg;
  if (type === 'config') {
    const {id, name} = value;
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
    return Promise.reject(new Error("请等待上一次请求结束"));
  }
  const {aiAssistantMap} = useAiAssistantStore();
  const {aiServiceMap} = useAiServiceStore();
  const assistant = aiAssistantMap.get(assistantId.value);
  if (!assistant) {
    return Promise.reject(new Error("AI 助手未找到"));
  }
  const service = aiServiceMap.get(assistant.aiServiceId);
  if (!service) {
    return Promise.reject(new Error("AI 服务未找到"));
  }

  const openAi = new OpenAI({
    baseURL: service.url,
    apiKey: service.key,
    dangerouslyAllowBrowser: true
  })

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
    name: utools.getUser()?.nickname || '用户',
    datetime: getCurrentTime(),
    assistantId: assistantId.value
  });
  isStreamLoad.value = true;
  loading.value = true;
  // 异步处理
  (async () => {
    chatList.value.unshift({
      role: 'assistant',
      // 模型
      name: aiAssistantMap.get(assistantId.value)?.name || 'AI 助理',
      content: '',
      datetime: getCurrentTime(),
      assistantId: assistantId.value
    })
    const response = await openAi.chat?.completions.create({
      model: assistant.model,
      messages: [
        {
          role: 'system',
          content: assistant.system
        },
        ...buildMessages(chatList.value)
      ],
      stream: true,
      temperature: assistant.temperature,
      top_p: assistant.topP,
    });
    // 流式处理结果
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      chatList.value[0].content += content;
      loading.value = false;
    }
  })()
    .catch(e => {
      MessageUtil.error("获取结果失败", e);
      chatList.value.unshift({
        role: 'error',
        name: '系统',
        content: `${e}`,
        datetime: getCurrentTime(),
        assistantId: assistantId.value
      })
    }).finally(() => {
    isStreamLoad.value = false;
    loading.value = false;
  })
}

function onStop() {

}

function handleOperation(type: string, e:{e: Error, index: number}) {
  if (type === 'copy') {
    copyText(chatList.value[e.index].content);
  }
}
</script>
<style scoped lang="less">
.chat {
  background-color: var(--color-bg-1);
  color: var(--color-text-1);

  .chat-header {
    height: 40px;
    border-bottom: 1px solid var(--color-border-1);
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
  }
}
</style>
