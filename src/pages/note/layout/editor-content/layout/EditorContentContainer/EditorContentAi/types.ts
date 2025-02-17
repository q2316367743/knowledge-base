export type MessageItem = MessageAssistant | MessageUser;
export interface MessageAssistant {
    role: 'assistant';
    content: string;
}

export interface MessageUser {
    role: 'user';
    content: string;
}
