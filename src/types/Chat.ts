export enum ChatAttachmentType {
  // 图片
  IMAGE = 'image',
  // 文件
  FILE = 'file',
  // 本地笔记
  NOTE = 'note'
}

export interface ChatAttachment {
  id: string;
  type: ChatAttachmentType;
  name: string;
  file: string;
}

export interface ChatInputProps {
  question: string;
  assistantId: string;
}

/**
 * 聊天记录
 */
export interface ChatMessage {
  // 提问时间
  id: number;
  // 问题
  q: string;
  // 思考过程
  t: string;
  // 答案
  a: string;
  // 使用的模型
  assistantId: string;
  // 是否思考中
  isThinking: boolean;
}

export interface ChatMessageParam {
  role: 'user' |  'assistant' | 'system';
  content: string;
}