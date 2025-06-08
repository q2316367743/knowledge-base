import {useSnowflake} from "@/hooks/Snowflake";

export enum AiServiceType {
  OPENAI = 'openai',
  // uTools提供
  U_TOOLS = 'uTools',
  // Ollama
  OLLAMA = 'Ollama'
}

export interface AiServiceModel {
  id: string;
  label: string;
  // 图标
  icon?: string;
  // 描述
  description: string;
  // 消耗量
  cost?: number;
}

export type AiServiceModelType = string | AiServiceModel;

/**
 * AI服务
 */
export interface AiService {
  id: string;
  createBy: number;
  updateBy?: number;
  name: string;
  type: AiServiceType;

  // 链接
  url: string;
  // 密钥
  key: string;
  // 模型版本
  modelVersion: string;
  // 模型、启用的模型
  models: Array<AiServiceModelType>;
}

export interface InnerAiService extends AiService {
  models: Array<AiServiceModel>
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
});

export const findModel = (models: Array<string | AiServiceModel>, modelId: string): AiServiceModel | null => {
  for (const model of models) {
    if (typeof model === 'string') {
      if (model === modelId) {
        return {
          id: model,
          label: model,
          icon: '',
          description: '',
          cost: 0
        };
      }
    } else {
      if (model.id === modelId) {
        return model;
      }
    }
  }
  return null;
}