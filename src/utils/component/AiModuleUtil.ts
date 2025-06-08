import {AiService, AiServiceModelType, AiServiceType} from "@/entity/ai/AiService";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import OpenAI from "openai";


async function getAllModulesFromOpenAI(aiService: AiService): Promise<Array<AiServiceModelType>> {
  if (isEmptyString(aiService.url)) return Promise.reject("请输入API 地址");
  if (isEmptyString(aiService.key)) return Promise.reject("请输入API 密钥");
  const openAi = new OpenAI({
    baseURL: aiService.url,
    apiKey: aiService.key,
    dangerouslyAllowBrowser: true
  })
  const res = await openAi.models.list();
  console.log(res)
  const items = new Array<string>();
  items.push(...res.data.map(e => e.id));
  while (res.hasNextPage()) {
    await res.getNextPage();
    items.push(...res.data.map(e => e.id));
  }
  return items;
}

/**
 * 获取ollama全部的模型
 * @param aiService 配置信息
 */
async function getAllModulesFromOllama(aiService: AiService): Promise<Array<AiServiceModelType>> {
  if (isEmptyString(aiService.url)) return Promise.reject("请输入API 地址");
  if (isEmptyString(aiService.key)) return Promise.reject("请输入API 密钥");

  const response = await fetch(`${aiService.url}/models`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${aiService.key}`
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching models from Ollama: ${response.statusText}`);
  }

  const data = await response.json();
  return data.models.map((model: any) => model.id);
}

export async function getAllModules(res: AiService): Promise<Array<AiServiceModelType>> {
  if (res.type === AiServiceType.OPENAI) {
    return getAllModulesFromOpenAI(res);
  } else if (res.type === AiServiceType.OLLAMA) {
    return getAllModulesFromOllama(res);
  } else {
    return Promise.reject("不支持的AI服务类型");
  }
}