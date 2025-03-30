import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {AiService, AiServiceType} from "@/entity/ai/AiService";
import {map} from "@/utils/lang/ArrayUtil";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import {versionLess} from "@/utils/lang/FieldUtil";

const DEFAULT_AI_SERVICES: Array<AiService> = [{
  id: '1',
  createBy: 1,
  name: 'uTools服务',
  type: AiServiceType.U_TOOLS,
  url: '',
  key: '',
  modelVersion: '',
  models: ['deepseek-r1', 'deepseek-v3'],
}]


export const useAiServiceStore = defineStore('ai-service', () => {
  const list = ref<Array<AiService>>([]);
  const rev = ref<string>();

  const aiServices = computed<Array<AiService>>(() => {
    let appVersion = utools.getAppVersion();
    if (versionLess(appVersion, 7)) {
      return list.value;
    }
    // 大于7.0才可以
    return [...DEFAULT_AI_SERVICES, ...list.value]
  });
  const aiServiceMap = computed(() => map(aiServices.value, 'id'));

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    list.value = res.list;
    rev.value = res.rev;
  }

  async function saveOrUpdate(aiService: AiService) {
    const index = list.value.findIndex(e => e.id === aiService.id);
    if (index !== -1) {
      list.value[index] = aiService;
    } else {
      list.value.push(aiService);
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
    aiServices, aiServiceMap,
    init, saveOrUpdate, remove,
  }

});