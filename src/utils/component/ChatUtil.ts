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

export async function askToOpenAi(props: AskToOpenAiProps): Promise<void> {
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

export async function askToUTools(props: AskToOpenAiProps): Promise<void> {
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

export async function askToAi(props: AskToOpenAiProps) {
  const {service} = props;
  if (service.type === AiServiceType.OPENAI) {
    await askToOpenAi(props);
  } else if (service.type === AiServiceType.U_TOOLS) {
    await askToUTools(props);
  } else {
    return Promise.reject(new Error("AI类型未知"));
  }
}