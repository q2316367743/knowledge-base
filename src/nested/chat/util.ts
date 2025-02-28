import {AiChatMessage} from "@/nested/chat/type";
import {ChatMessageParam} from "@/types/Chat";

const allowRoles = ['user','assistant'];

export function buildMessages(list: Array<AiChatMessage>): Array<ChatMessageParam> {
  let messages = Array.from(list);
  return messages.reverse().filter(e => allowRoles.includes(e.role)).map(e => ({
    role: e.role,
    content: e.content
  } as ChatMessageParam));
}

export function getCurrentTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`
}