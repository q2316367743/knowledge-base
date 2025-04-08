import OpenAI from "openai";
import {ChatMessageParam} from "@/types/Chat";
import {AiService, AiServiceType} from "@/entity/ai/AiService";
import {AiAssistant} from "@/entity/ai/AiAssistant";

export interface AskToOpenAiAbort {
  abort: (reason?: string) => void;
}

interface AskToOpenAiProps {
  messages: Array<ChatMessageParam>;
  service: AiService;
  assistant: AiAssistant;
  onAppend: (data: string, t?: boolean) => void;
  onAborted: (a: AskToOpenAiAbort) => void;
}

async function askToOpenAi(props: AskToOpenAiProps): Promise<void> {
  const {messages, service, assistant, onAppend, onAborted} = props;
  const openAi = new OpenAI({
    baseURL: service.url,
    apiKey: service.key,
    dangerouslyAllowBrowser: true
  });

  const response = await openAi.chat?.completions.create({
    model: assistant.model,
    messages,
    stream: true,
    temperature: assistant.temperature,
    top_p: assistant.topP,
    // top_logprobs: assistant.maxChats,
  });
  onAborted(response.controller);

  // 流式处理结果
  for await (const chunk of response) {
    const content = chunk.choices[0]?.delta?.content || '';
    onAppend(content);
  }
}

async function askToUTools(props: AskToOpenAiProps): Promise<void> {
  const {messages, service, assistant, onAppend, onAborted} = props;
  if (!service.models.map(e => typeof e === 'string' ? e : e.id).find(e => e === assistant.model)) {
    return Promise.reject(new Error("AI助手选择的模型已不支持"));
  }

  // 适配新版utools ai接口
  const abortPromise = utools.ai({model: assistant.model, messages}, (delta) => {
    const msg = delta.reasoning_content || delta.content;
    if (msg) {
      onAppend(msg, !!delta.reasoning_content);
    }
  })
  onAborted({
    abort() {
      abortPromise.abort();
      // 无奈之举
      onAppend("\n\n请求被手动终止！");
    },
  });
  await abortPromise;
}

/**
 * 向Ollama进行提问
 * @param props 参数
 */
async function askToOllama(props: AskToOpenAiProps): Promise<void> {
  const {messages, service, assistant, onAppend, onAborted} = props;

  // 假设 Ollama 的 API 地址和密钥存储在 service 中
  const response = await fetch(`${service.url}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${service.key}`,
    },
    body: JSON.stringify({
      model: assistant.model,
      messages,
      stream: true,
      temperature: assistant.temperature,
      top_p: assistant.topP,
    }),
  });

  if (!response.ok) {
    return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
  }

  const reader = response.body?.getReader();
  if (!reader) {
    return Promise.reject(new Error("无法获取流"));
  }
  const decoder = new TextDecoder('utf-8');
  let done = false;

  // 创建一个 AbortController 来处理中止请求
  const controller = new AbortController();
  onAborted({abort: () => controller.abort()});

  while (!done) {
    const {value, done: readerDone} = await reader!.read();
    done = readerDone;
    if (value) {
      const chunk = decoder.decode(value, {stream: true});
      // 假设 Ollama 返回的数据格式与 OpenAI 类似
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.replace('data: ', ''));
          const content = data.choices[0]?.delta?.content || '';
          onAppend(content);
        }
      }
    }
  }
}


export async function askToAi(props: AskToOpenAiProps) {
  const {service} = props;
  if (service.type === AiServiceType.OPENAI) {
    await askToOpenAi(props);
  } else if (service.type === AiServiceType.U_TOOLS) {
    await askToUTools(props);
  } else if (service.type === AiServiceType.OLLAMA) {
    await askToOllama(props);
  } else {
    return Promise.reject(new Error("AI类型未知"));
  }
}