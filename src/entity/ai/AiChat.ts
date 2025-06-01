import {TdChatItemProps} from "@tdesign-vue-next/chat";
import {ChatMessageParam} from "@/types/Chat";

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

export function buildAiChatGroupWrap() {
  return {
    id: '0',
    name: '默认分组',
    prompt: ''
  };
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

export interface AiChatItem extends TdChatItemProps {
  // 时间
  time: number;
  // 内容
  content: string;
  // 思考
  think?: string;

  // 拓展
  aiServiceId: string;
  // 服务名称，冗余
  service: string;
  // 模型，冗余
  model: string;
}

export function transferAiChatItemToChatMessageParam(items: Array<AiChatItem>): Array<ChatMessageParam> {
  const p = new Array<ChatMessageParam>();
  items.forEach(item => {
    if (item.role === 'system' || item.role === 'user' || item.role === 'assistant') {
      p.push({
        role: item.role,
        content: item.content
      });
    }
  });
  p.reverse();
  return p;
}

/**
 * 聊天项
 * /item/ai/chat/${chatId}
 */
export interface AiChatContent {

  // 文章引用
  references: Array<number>;

  // 聊天内容
  items: Array<AiChatItem>;
}

export interface AiChatWrap extends AiChatList, AiChatContent {
  groupId: string;
  rev?: string;
}