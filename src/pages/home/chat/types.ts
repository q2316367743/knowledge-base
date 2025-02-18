export interface ChatArticleItem {
  id: string;
  q: string;
  a: string;
  m: string
}

export interface ChatMessage {
  loading: boolean;
  messages: Array<ChatArticleItem>;
}

export const buildChatMessage = (): ChatMessage => ({
  loading: false,
  messages: []
})

export const ChatMessageInjection = Symbol() as InjectionKey<Ref<ChatMessage>>