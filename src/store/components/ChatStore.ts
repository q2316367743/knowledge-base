import {defineStore} from "pinia";
import {ChatMessage, ChatMessageParam} from "@/types/Chat";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsKvStorage} from "@/hooks/UtoolsKvStorage";
import {isNotEmptyArray, isNotEmptyString} from "@/utils/lang/FieldUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {askToAi, AskToOpenAiAbort} from "@/utils/component/ChatUtil";


export const serviceId = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_SERVICE, "");
export const assistantId = useUtoolsKvStorage<string>(LocalNameEnum.KEY_HOME_ASSISTANT, "");

watch(serviceId, () => assistantId.value = '');

export const useChatStore = defineStore('chat', () => {
  // 消息
  const messages = ref(new Array<ChatMessage>());
  // 最后的一个消息
  const lastId = ref(0);
  const loading = ref(false);

  const abort = shallowRef<AskToOpenAiAbort>();

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

  function appendTo(id: number, data: string, t?: boolean) {
    for (let m of messages.value) {
      if (m.id === id) {
        if (t) {
          m.t += data;
        } else {
          m.a += data;
        }
        m.isThinking = !!t;
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

    const articleIds: Array<number> = res || [];

    const now = Date.now();
    const oldMessages = buildMessage();
    lastId.value = now;
    loading.value = true;
    messages.value.push({
      id: now,
      q: question,
      t: '',
      a: '',
      assistantId: assistant.id,
      isThinking: false
    });
    // 异步处理
    (async () => {

      // 获取笔记
      const articles = new Array<ChatMessageParam>();
      if (isNotEmptyArray(articleIds)) {
        const {getContent} = useArticleStore()
        const contents = new Array<string>()
        for (const articleId of articleIds) {
          const c = await getContent(articleId);
          if (c.record) {
            contents.push(typeof c.record === 'object' ? JSON.stringify(c.record) : c.record)
          }
        }
        if (isNotEmptyArray(contents)) {
          articles.push({
            role: 'system',
            content: `根据以下文件内容回答问题：\n${contents.join('\n\n')}`
          })
        }
      }
      const messages = new Array<ChatMessageParam>();
      if (isNotEmptyString(assistant.system)) {
        messages.push({
          role: 'system',
          content: assistant.system,
        })
      }
      messages.push(...articles, ...oldMessages, {
        role: 'user',
        content: question,
      });

      await askToAi({
        messages,
        service,
        assistant,
        onAppend: (data, t) => {
          appendTo(now, data, t);
          loading.value = false;
        },
        onAborted: (e) => {
          abort.value = e;
        }
      })
    })()
      .catch(e => {
        if (e.name === "AbortError") {
          if (messages.value.length > 0) {
            appendTo(now, "\n\n请求被手动终止！");
          }
        } else {
          appendTo(now, "\n\n请求出现错误！");
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
  }


  return {
    messages, steamLoading, empty, lastId, assistantId, loading,
    ask, stop, clear
  }
})