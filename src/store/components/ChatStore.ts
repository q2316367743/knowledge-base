import {defineStore} from "pinia";
import OpenAI from "openai";
import {ChatMessage, ChatMessageParam} from "@/types/Chat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";

export const chatToBottomEvent = useEventBus('chat-to-bottom');


export const useChatStore = defineStore('chat', () => {
  // 引用的文章
  const articleIds = ref(new Array<number>());
  // 消息
  const messages = ref(new Array<ChatMessage>());
  // 最后的一个消息
  const lastId = ref(0);
  const loading = ref(false);

  const assistantId = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_ASSISTANT, "");

  const abort = shallowRef<AbortController>();

  const empty = computed(() => messages.value.length === 0);
  const steamLoading = computed(() => {
    return lastId.value !== 0;
  });

  function buildMessage(): Array<ChatMessageParam> {
    const m = new Array<ChatMessageParam>();
    messages.value.forEach(e => {
      m.push({
        role: 'user',
        content: e.q
      }, {
        role: 'assistant',
        content: e.a
      })
    })
    return m;
  }

  function appendTo(id: number, content: string) {
    for (let m of messages.value) {
      if (m.id === id) {
        m.a += content;
        chatToBottomEvent.emit();
        return;
      }
    }
  }

  async function ask(question: string, res?: Array<number>) {
    if (steamLoading.value) {
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

    if (res) {
      articleIds.value = res;
    }

    const openAi = new OpenAI({
      baseURL: service.url,
      apiKey: service.key,
      dangerouslyAllowBrowser: true
    })

    const now = Date.now();
    const oldMessages = buildMessage();
    lastId.value = now;
    loading.value = true;
    messages.value.push({
      id: now,
      q: question,
      a: '',
      assistantId: assistant.id,
    });
    // 异步处理
    (async () => {
      const response = await openAi.chat?.completions.create({
        model: assistant.model,
        messages: [
          // 助手提示词
          {
            role: 'system',
            content: assistant.system
          },
          // TODO: 附带的文章
          // 历史消息
          ...oldMessages,
          // 当前的问题
          {
            role: 'user',
            content: question,
          }],
        stream: true,
        temperature: assistant.temperature,
        top_p: assistant.topP,
        // top_logprobs: assistant.maxChats,
      });
      abort.value = response.controller;
      // 流式处理结果
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        appendTo(now, content);
        loading.value = false;
      }
    })()
      .catch(e => {
        if (e.name === "AbortError") {
          if (messages.value.length > 0) {
            appendTo(now, "\n\n求被手动终止！");
          }
        } else {
          MessageUtil.error("获取结果失败", e);
        }
      })
      .finally(() => {
        lastId.value = 0;
        loading.value = false;
      });
  }

  async function stop() {
    abort.value?.abort();
  }

  async function clear() {
    // 先停止
    await stop();
    // 再清空
    messages.value = [];
    lastId.value = 0;
    articleIds.value = [];
  }

  function changeAssistantId(id: string) {
    assistantId.value = id;
  }

  return {
    messages, steamLoading, empty, lastId, assistantId, loading,
    ask, stop, clear, changeAssistantId
  }
})