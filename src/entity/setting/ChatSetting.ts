export interface ChatSetting {
    enable: boolean;
    api: string;
    token: string;
    model: string
}

export function getDefaultChatSetting(): ChatSetting {
    return {
        enable: false,
        api: 'https://api.openai.com',
        token: '',
        model: 'gpt-3.5-turbo'
    }
}
