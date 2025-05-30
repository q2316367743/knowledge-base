/**
 * 聊天分组
 * /list/ai/group
 */
export interface AiChatGroup {
  id: string;
  name: string;
}


/**
 * 聊天分组
 * /item/ai/group/${groupId}
 */
export interface AiChatGroupItem {
  prompt: string;
}

export interface AiChatGroupWrap {
  name: string;
  prompt: string;
}

/**
 * ai聊天列表
 * /list/ai/chat/${groupId}
 */
export interface AiChatList {
  // 聊天ID，用于获取内容
  id: string;
  name: string;
  createBy: number;
  top: boolean;
}

export interface AiChatItem {
  role: string;
  content: string;
  reason: string;
  aiServiceId: string;
  aiModel: string;
}

/**
 * 聊天项
 * /item/ai/chat/${chatId}
 */
export interface AiChat {

  items: AiChatItem;
}