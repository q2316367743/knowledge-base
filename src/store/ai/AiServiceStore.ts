import {defineStore} from "pinia";
import {AiService} from "@/entity/ai/AiService";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export const useAiServiceStore = defineStore('ai-service', () => {
  const aiServices = ref<Array<AiService>>([]);
  const rev = ref<string>();

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    aiServices.value = res.list;
    rev.value = res.rev;
  }

  init().then(() => console.debug("ai服务初始化成功"));

  async function saveOrUpdate(aiService: AiService) {
    const index = aiServices.value.findIndex(e => e.id === aiService.id);
    if (index !== -1) {
      aiServices.value[index] = aiService;
    } else {
      aiServices.value.push(aiService);
    }
    rev.value = await saveListByAsync(LocalNameEnum.AI_SERVICE, aiServices.value, rev.value);
  }

  async function remove(id: string) {
    const index = aiServices.value.findIndex(e => e.id === id);
    if (index !== -1) {
      aiServices.value.splice(index, 1);
      rev.value = await saveListByAsync(LocalNameEnum.AI_SERVICE, aiServices.value, rev.value);
    }
  }

  return {
    aiServices,
    saveOrUpdate, remove,
  }

});