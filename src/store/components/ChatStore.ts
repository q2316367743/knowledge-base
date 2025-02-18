import {defineStore} from "pinia";
import {ChatInputProps, ChatMessage, ChatMessageParam} from "@/types/Chat";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useEventBus} from "@vueuse/core";

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
    const {openAi, model} = useChatSettingStore();
    if (!openAi) {
      return Promise.reject(new Error("请配置AI"));
    }
    if (loading.value) {
      return Promise.reject(new Error("请等待上一次请求结束"));
    }
    const now = Date.now();
    const oldMessages = buildMessage();
    lastId.value = now;
    messages.value.push({
      id: now,
      q: p.question,
      a: '',
      m: (p.model || model) as string,
      f: p.attachments
    });
    // 异步处理
    (async () => {
      const response = await openAi.chat?.completions.create({
        model: (p.model || model) as string,
        messages: [...oldMessages, {
          role: 'user',
          content: p.question,
        }],
        stream: true,
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