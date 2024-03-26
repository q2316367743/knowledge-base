export interface MessageAssistant {
    role: 'assistant';
    content: string;
}

export interface MessageUser {
    role: 'user';
    content: string;
}

export interface MessageSystem {
    role: 'system';
    content: string;
}

export type MessageItem = MessageAssistant | MessageUser | MessageSystem;

export interface ArticleAiChat {

    /**
     * 消息
     */
    messages: Array<MessageItem>;

}

export interface ArticleAiAsk {

    /**
     * 上传的恢复标签
     */
    version: string;

    /**
     * 文件ID
     */
    fileId: string;

    /**
     * 问题
     */
    question: string;

    /**
     * 答案
     */
    answer: string;

}

export interface ArticleAi {

    /**
     * 聊天
     */
    chat: ArticleAiChat;

    /**
     * 问答
     */
    ask: ArticleAiAsk;

}

export function getDefaultArticleAi(): ArticleAi {
    return {
        ask: {
            // 暂时不用
            version: '',
            fileId: '',

            question: '',
            answer: '',
        },
        chat: {
            messages: [{
                role: 'system',
                content: '你好，我是Ai小助手，需要帮助吗？'
            }]
        }
    }
}
