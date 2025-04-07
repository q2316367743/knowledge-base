import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {AiService, AiServiceModel, AiServiceType} from "@/entity/ai/AiService";
import {map} from "@/utils/lang/ArrayUtil";
import {versionLess} from "@/utils/lang/FieldUtil";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";


const DEFAULT_AI_SERVICE: AiService = {
  id: '1',
  createBy: 0,
  updateBy: 0,
  name: 'uTools服务',
  type: AiServiceType.U_TOOLS,
  url: '',
  key: '',
  modelVersion: '',
  models: [],
}


export const useAiServiceStore = defineStore('ai-service', () => {

  const list = ref<Array<AiService>>([]);
  const rev = ref<string>();
  const uToolsModels = ref<Array<AiServiceModel>>([]);

  const aiServices = computed<Array<AiService>>(() => {
    let appVersion = utools.getAppVersion();
    if (versionLess(appVersion, 7)) {
      return list.value;
    }
    // 大于7.0才可以
    return [{
      ...DEFAULT_AI_SERVICE,
      updateBy: Date.now(),
      models: uToolsModels.value
    }, ...list.value]
  });
  const aiServiceMap = computed(() => map(aiServices.value, 'id'));

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    list.value = res.list;
    rev.value = res.rev;
    let appVersion = utools.getAppVersion();
    if (versionLess(appVersion, 7)) {
      // 小于7，不初始化uTools模型
      return;
    }
    // 初始化uTools模型
    uToolsModels.value = await utools.allAiModels();
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
    aiServices, aiServiceMap,uToolsModels,
    init, saveOrUpdate, remove,
  }

});