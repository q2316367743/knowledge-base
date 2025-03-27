import OpenAI from "openai";
import {ChatMessageParam} from "@/types/Chat";
import {AiService, AiServiceType} from "@/entity/ai/AiService";
import {AiAssistant} from "@/entity/ai/AiAssistant";

interface AskToOpenAiProps {
  messages: Array<ChatMessageParam>;
  service: AiService;
  assistant: AiAssistant;
  onAppend: (data: string) => void;
  onAborted: (a: AbortController) => void;
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

  // TODO: 适配新版utools ai接口
  // @ts-ignore
  await utools.ai({model: assistant.model, messages}, (delta) => {
    console.log(delta);
    onAppend(delta.reasoning_content || delta.content);
  })
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