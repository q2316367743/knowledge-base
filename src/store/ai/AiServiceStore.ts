import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {AiService, InnerAiService} from "@/entity/ai/AiService";
import {map} from "@/utils/lang/ArrayUtil";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";




export const useAiServiceStore = defineStore('ai-service', () => {

  const list = ref<Array<AiService>>([]);
  const rev = ref<string>();
  const innerAiService = ref<InnerAiService | null>(null);

  const aiServices = computed<Array<AiService>>(() => {
    if (!innerAiService.value) {
      return list.value;
    }
    return [innerAiService.value, ...list.value]
  });
  const aiServiceMap = computed(() => map(aiServices.value, 'id'));

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    list.value = res.list;
    rev.value = res.rev;
    // 初始化内置模型
    innerAiService.value = await InjectionUtil.ai.service();
  }

  async function saveOrUpdate(aiService: AiService) {
    const index = list.value.findIndex(e => e.id === aiService.id);
    const target: AiService = {
      ...aiService,
      updateBy: Date.now()
    }
    if (index !== -1) {
      list.value[index] = target;
    } else {
      list.value.push(target);
    }
    rev.value = await saveListByAsync(LocalNameEnum.AI_SERVICE, list.value, rev.value);
  }

  async function remove(id: string) {
    const index = list.value.findIndex(e => e.id === id);
    if (index !== -1) {
      list.value.splice(index, 1);
      rev.value = await saveListByAsync(LocalNameEnum.AI_SERVICE, list.value, rev.value);
    }
  }

  return {
    aiServices, aiServiceMap, innerAiService,
    init, saveOrUpdate, remove,
  }

});