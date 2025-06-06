import {defineStore} from "pinia";
import {AiChatContent, AiChatItem, AiChatList, AiChatWrap} from "@/entity/ai/AiChat";
import {
  DbList,
  getFromOneByAsync,
  listByAsync,
  removeOneByAsync,
  saveListByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useSnowflake} from "@/hooks/Snowflake";
import {renderChat, renderModel} from "@/pages/home/model";
import {useAiServiceStore} from "@/store";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import {isNotEmptyArray} from "@/utils/lang/FieldUtil";

export const useAiChatListStore = defineStore('ai-chat-list', () => {
  const lists = ref(new Array<AiChatList>());
  const rev = ref<string>();
  let isInit = false;

  const listBy = async (groupId: string): Promise<DbList<AiChatList>> => {
    return listByAsync<AiChatList>(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId);
  }

  const saveList = (groupId: string, list: DbList<AiChatList>) => {
    return saveListByAsync<AiChatList>(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId, list.list, list.rev);
  }

  const reInit = async () => {
    // 无分组的ai列表
    const res = await listBy('0');
    lists.value = res.list;
    rev.value = res.rev;
  }

  const init = async () => {
    if (isInit) return;
    isInit = true;
    await reInit();
  }

  const getList = async (groupId: string) => {
    let l: Array<AiChatList>;
    let r: string | undefined;
    if (groupId === '0') {
      l = lists.value;
      r = rev.value
    } else {
      // 获取
      const g = await listByAsync<AiChatList>(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId);
      l = g.list;
      r = g.rev;
    }
    return {l, r}
  }

  const post = async (groupId: string, question: string, modelKey: string, references?: Array<number>): Promise<string> => {
    const id = useSnowflake().nextId();
    let {l, r} = await getList(groupId);
    // 添加到列表
    l.push({
      id: id,
      name: question.substring(0, Math.min(10, question.length)),
      createBy: Date.now(),
      top: false
    });
    r = await saveListByAsync(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId, l, r);
    if (groupId === '0') {
      rev.value = r;
    }
    const {aiServiceId, model} = renderModel(modelKey);
    const service = useAiServiceStore().aiServiceMap.get(aiServiceId);
    if (!service) return Promise.reject(new Error("AI 服务不存在"));
    // 保存详情
    const items = new Array<AiChatItem>();
    const time = Date.now();
    items.push({
      time,
      role: 'user',
      content: question,
      aiServiceId,
      service: service.name,
      model
    });
    if (isNotEmptyArray(references)) {
      // TODO: 文章引用
    }
    // 如果有分组
    const group = await useAiChatGroupStore().getById(groupId);
    if (group.prompt.trim() != '') {
      items.push({
        time,
        role: 'system',
        content: group.prompt,
        aiServiceId,
        service: service.name,
        model
      });
    }
    await saveOneByAsync<AiChatContent>(LocalNameEnum.ITEM_AI_CHAT_ + '/' + id, {
      references: references || [],
      items
    });
    return id;
  }

  const updateById = async (groupId: string, data: Partial<AiChatList> & { id: string }) => {
    let {l, r} = await getList(groupId);
    const index = l.findIndex(e => e.id === data.id);
    if (index === -1) return Promise.reject(new Error("未找到聊天"));
    l[index] = {
      ...l[index],
      ...data,
    };
    r = await saveListByAsync(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId, l, r);
    if (groupId === '0') {
      rev.value = r;
    }
  }

  const remove = async (groupId: string, chatId: string) => {
    let {l, r} = await getList(groupId);
    const index = l.findIndex(e => e.id === chatId);
    if (index === -1) return Promise.reject(new Error("未找到聊天"));
    l.splice(index, 1);
    r = await saveListByAsync(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId, l, r);
    if (groupId === '0') {
      rev.value = r;
    }
    // 删除详情
    await removeOneByAsync(LocalNameEnum.ITEM_AI_CHAT_ + '/' + chatId);
  }

  const getInstance = async (key: string): Promise<AiChatWrap> => {
    const {groupId, chatId} = renderChat(key);
    const g = await listByAsync<AiChatList>(LocalNameEnum.LIST_AI_CHAT_ + '/' + groupId);
    const l = g.list.find(l => l.id === chatId);
    if (!l) return Promise.reject(new Error("未找到聊天"));
    const c = await getFromOneByAsync<AiChatContent>(LocalNameEnum.ITEM_AI_CHAT_ + '/' + chatId);
    return {
      ...l,
      ...(c.record || {references: [], items: []}),
      rev: c.rev,
      groupId
    }
  }

  const saveContent = async (id: string, c: AiChatContent, rev?: string) => {
    return saveOneByAsync(LocalNameEnum.ITEM_AI_CHAT_ + '/' + id, c, rev);
  }

  return {lists,reInit, init, post, updateById, remove, getInstance, saveContent, listBy, saveList}

})