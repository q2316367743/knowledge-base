import {useSnowflake} from "@/hooks/Snowflake";

export enum AiServiceType {
  OPENAI = 'openai',
  // uTools提供
  U_TOOLS = 'uTools'
}

/**
 * AI服务
 */
export interface AiService {
  id: string;
  createBy: number;
  name: string;
  type: AiServiceType;

  // 链接
  url: string;
  // 密钥
  key: string;
  // 模型版本
  modelVersion: string;
  // 模型、启用的模型
  models: Array<string>;
}

export const buildAiService = (): AiService => ({
  id: useSnowflake().nextId(),
  createBy: Date.now(),
  name: '',
  type: AiServiceType.OPENAI,
  url: '',
  key: '',
  modelVersion: '',
  models: []
})