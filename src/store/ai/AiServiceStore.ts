import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {AiService, AiServiceModel, AiServiceType} from "@/entity/ai/AiService";
import {map} from "@/utils/lang/ArrayUtil";
import {versionLess} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {getItem, listByAsync, saveListByAsync, setItem} from "@/utils/utools/DbStorageUtil";

interface UToolsModel {
  id: string;
  label: string;
  // 图标
  icon: string;
  // 描述
  description: string;
  // 消耗量
  cost: number;
}

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
  const now = Date.now();

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
    // 初始化uTools模型
    // @ts-ignore
    uToolsModels.value = await utools.allAiModels() as Array<UToolsModel>;
    console.log('uToolsModels', uToolsModels.value)
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
    aiServices, aiServiceMap,
    init, saveOrUpdate, remove,
  }

});