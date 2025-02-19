/**
 * AI助手
 */
export interface AiAssistant {
  id: string;
  createBy: number;

  // 助手名称
  name: string;
  // 提示词
  system: string;

  // 使用的服务
  aiServiceId: string;
  // 使用的默认模型
  model: string;
  // 模型温度，0-2，一位小数
  temperature: number;
  // Top-P，0-1，二位小数
  topP: number;
  // 上下文数
  maxChats: number;
}