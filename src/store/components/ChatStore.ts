import {defineStore} from "pinia";
import OpenAI from "openai";
import {ChatInputProps, ChatMessage, ChatMessageParam} from "@/types/Chat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useEventBus} from "@vueuse/core";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";

export const chatToBottomEvent = useEventBus('chat-to-bottom');


export const useChatStore = defineStore('chat', () => {
  const messages = ref(new Array<ChatMessage>());
  const lastId = ref(0);

  const empty = computed(() => messages.value.length === 0);
  const loading = computed(() => {
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

  async function ask(p: ChatInputProps) {
    if (loading.value) {
      return Promise.reject(new Error("请等待上一次请求结束"));
    }
    const {aiAssistantMap} = useAiAssistantStore();
    const {aiServiceMap} = useAiServiceStore();
    const assistant = aiAssistantMap.get(p.assistantId);
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

    const now = Date.now();
    const oldMessages = buildMessage();
    lastId.value = now;
    messages.value.push({
      id: now,
      q: p.question,
      a: '',
      assistantId: assistant.id,
      f: p.attachments,
    });
    // 异步处理
    (async () => {
      const response = await openAi.chat?.completions.create({
        model: assistant.model,
        messages: [
          {
            role: 'system',
            content: assistant.system
          },
          ...oldMessages, {
            role: 'user',
            content: p.question,
          }],
        stream: true,
        temperature: assistant.temperature,
        top_p: assistant.topP,
        // top_logprobs: assistant.maxChats,
      });
      // 流式处理结果
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        appendTo(now, content);
      }
    })()
      .catch(e => {
        MessageUtil.error("获取结果失败", e);
      }).finally(() => {
      lastId.value = 0;
    })
  }

  async function stop() {

  }

  async function clear() {
    // 先停止
    await stop();
    // 再清空
    messages.value = [];
    lastId.value = 0;
  }


  return {
    messages, loading, empty, lastId,
    ask, stop, clear
  }
})