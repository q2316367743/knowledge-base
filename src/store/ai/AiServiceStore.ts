import {defineStore} from "pinia";
import {AiService, AiServiceType} from "@/entity/ai/AiService";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";

const DEFAULT_AI_SERVICES: Array<AiService> = [{
  id: '1',
  createBy: 1,
  name: 'deepseek',
  type: AiServiceType.U_TOOLS,
  url: '',
  key: '',
  modelVersion: '',
  models: ['deepseek-r1', 'deepseek-v3'],
}]


export const useAiServiceStore = defineStore('ai-service', () => {
  const aiServices = ref<Array<AiService>>([]);
  const rev = ref<string>();


  const aiServiceMap = computed(() => map(aiServices.value, 'id'));

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    aiServices.value = [...DEFAULT_AI_SERVICES, ...res.list];
    rev.value = res.rev;
  }

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
    aiServices, aiServiceMap,
    init, saveOrUpdate, remove,
  }

});