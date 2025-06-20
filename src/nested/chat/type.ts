export interface AiChatMessage {
  role: 'user' |  'assistant' | 'error' | 'model-change' | 'system',
  avatar?: string;
  name?: string;
  datetime?: string;
  content: string;
  assistantId?: string
  reasoning?: string;
  think?:boolean
}