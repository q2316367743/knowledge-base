/**
 * 聊天记录
 */
export interface ChatMessage {
  // 提问时间
  id: number;
  // 使用的模型
  assistantId: string;
  // 问题
  q: string;
  // 思考过程
  t: string;
  // 答案
  a: string;
  // 是否思考中
  isThinking: boolean;
}

export interface ChatMessageParam {
  role: 'user' |  'assistant' | 'system';
  content: string;
}