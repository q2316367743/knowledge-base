export interface AiChatMessage {
  role: 'user' |  'assistant' | 'error' | 'dialog-change' | 'system',
  avatar?: string;
  name?: string;
  datetime?: string;
  content: string;
  assistantId?: string
  reasoning?: string;
  think?:boolean
}