export enum HomeAttachmentType {
  // 图片
  IMAGE = 'image',
  // 文件
  FILE = 'file',
  // 本地笔记
  NOTE = 'note'
}

export interface HomeAttachment {
  id: string;
  type: HomeAttachmentType;
  name: string;
  file: string;
}

export interface AiInputProps {
  question: string;
  model: string;
  attachments: Array<HomeAttachment>
}