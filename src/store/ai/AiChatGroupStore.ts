import {defineStore} from "pinia";
import {
  AiChatGroup,
  AiChatGroupItem,
  AiChatGroupPostWrap,
  AiChatGroupWrap,
  buildAiChatGroupWrap
} from "@/entity/ai/AiChat";
import {
  getFromOneByAsync,
  listByAsync,
  removeOneByAsync,
  saveListByAsync,
  saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useSnowflake} from "@/hooks/Snowflake";

export const useAiChatGroupStore = defineStore('ai-chat-group', () => {
  const groups = ref(new Array<AiChatGroup>());
  const rev = ref<string>();
  let isInit = false;

  const init = async () => {
    if (isInit) return;
    isInit = true;
    const res = await listByAsync(LocalNameEnum.LIST_AI_GROUP);
    groups.value = res.list;
    rev.value = res.rev;
  }

  const add = async (g: AiChatGroupPostWrap) => {
    const id = useSnowflake().nextId();
    groups.value.push({
      id,
      name: g.name
    });
    rev.value = await saveListByAsync(LocalNameEnum.LIST_AI_GROUP, groups.value, rev.value);
    await saveOneByAsync<AiChatGroupItem>(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`, {
      prompt: g.prompt
    });
  }

  const update = async (id: string, g: AiChatGroupPostWrap) => {
    const index = groups.value.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error("分组不存在"));
    groups.value[index] = {
      id,
      name: g.name
    }
    rev.value = await saveListByAsync(LocalNameEnum.LIST_AI_GROUP, groups.value, rev.value);
    await removeOneByAsync(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`);
    await saveOneByAsync<AiChatGroupItem>(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`, {
      prompt: g.prompt
    });
  }

  const removeById = async (id: string) => {
    const index = groups.value.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error("分组不存在"));
    groups.value.splice(index, 1);
    rev.value = await saveListByAsync(LocalNameEnum.LIST_AI_GROUP, groups.value, rev.value);
    await removeOneByAsync(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`);
  }

  const getById = async (id: string): Promise<AiChatGroupWrap> => {
    if (id === '0') return buildAiChatGroupWrap();
    const index = groups.value.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error("分组不存在"));
    const c = await getFromOneByAsync<AiChatGroupItem>(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`);
    return {
      ...groups.value[index],
      ...(c.record || {prompt: ''}),
      rev: c.rev
    }
  }

  const updatePromptById = (id: string, prompt: string, rev?: string): Promise<string | undefined> => {
    return saveOneByAsync<AiChatGroupItem>(`${LocalNameEnum.ITEM_AI_GROUP_}/${id}`, {
      prompt
    }, rev);
  }

  const renameById = async (id: string, name: string) => {
    if (id === '0') return Promise.resolve();
    const index = groups.value.findIndex(e => e.id === id);
    if (index === -1) return Promise.reject(new Error("分组不存在"));
    groups.value[index].name = name;
    rev.value = await saveListByAsync(LocalNameEnum.LIST_AI_GROUP, groups.value, rev.value);
  }

  const sort = async (l: Array<AiChatGroup>) => {
    groups.value = l;
    rev.value = await saveListByAsync(LocalNameEnum.LIST_AI_GROUP, groups.value, rev.value);
  }

  return {
    groups, init, add, update, removeById, getById, updatePromptById, renameById, sort
  }

})