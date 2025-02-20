import {AiChatMessage} from "@/nested/chat/type";
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";

const allowRoles = ['user','assistant','system'];

export function buildMessages(list: Array<AiChatMessage>): Array<ChatCompletionMessageParam> {
  let messages = Array.from(list);
  return messages.reverse().filter(e => allowRoles.includes(e.role)).map(e => ({
    role: e.role,
    content: e.content
  }));
}

export function getCurrentTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}`
}