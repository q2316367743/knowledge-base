export interface ChatSetting {
    enable: boolean;
    api: string;
    token: string;
    model: string
}

export function getDefaultChatSetting(): ChatSetting {
    return {
        enable: false,
        api: 'https://api.tutujin.com/v1',
        token: '',
        model: 'gpt-3.5-turbo'
    }
}
