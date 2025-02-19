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
  attachments: Array<ChatAttachment>
}

export interface ChatMessage {
  // 提问时间
  id: number;
  // 问题
  q: string;
  // 答案
  a: string;
  // 使用的附件
  f: Array<ChatAttachment>;
  // 使用的模型
  assistantId: string;
}

export interface ChatMessageParam {
  role: 'user' |  'assistant';
  content: string;
}