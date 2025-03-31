import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {AiService, AiServiceModel, AiServiceType} from "@/entity/ai/AiService";
import {map} from "@/utils/lang/ArrayUtil";
import {versionLess} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {getItem, listByAsync, saveListByAsync, setItem} from "@/utils/utools/DbStorageUtil";

interface UToolsModel {
  model_id: string;
  model_name: string;
  point: number;
}

const DEFAULT_AI_SERVICE: AiService = {
  id: '1',
  createBy: 0,
  name: 'uTools服务',
  type: AiServiceType.U_TOOLS,
  url: '',
  key: '',
  modelVersion: '',
  models: [],
}


export const useAiServiceStore = defineStore('ai-service', () => {
  const lastUpdate = getItem<number>(LocalNameEnum.KEY_COMPONENT_U_TOOLS_MODEL_UPDATE) || 0;
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
      updateBy: lastUpdate,
      models: uToolsModels.value
    }, ...list.value]
  });
  const aiServiceMap = computed(() => map(aiServices.value, 'id'));

  async function init() {
    const res = await listByAsync<AiService>(LocalNameEnum.AI_SERVICE);
    list.value = res.list;
    rev.value = res.rev;
    // 获取已保存的模型
    const models = await listByAsync<AiServiceModel>(LocalNameEnum.AI_U_TOOLS_MODELS);
    if (models) {
      uToolsModels.value = models.list;
    }
    // 获取系统模型
    (async () => {
      if (now - lastUpdate < 1000 * 60 * 60 * 24) {
        // 更新时间小于一天
        return Promise.resolve();
      }
      const rsp = await fetch("https://open.u-tools.cn/v5/AI/llms");
      const body = await rsp.json() as Array<UToolsModel>;
      // 此处需要body与uToolsModels.value进行对比，如果uToolsModels.value不为空，且body与uToolsModels.value存在差异，需要提示出来
      const target = body.map(e => ({
        id: e.model_id,
        name: e.model_name,
        point: e.point,
      }));
      if (uToolsModels.value.length !== 0) {
        const diff = target.filter(e => !uToolsModels.value.find(m => m.id === e.id));
        if (diff.length > 0) {
          // 存在新增的模型
          NotificationUtil.warning("新增模型：" + diff.map(e => e.name).join("，"), "uTools模型有更新");
        }
        // 存在删除的模型
        const deleted = uToolsModels.value.filter(m => !target.find(e => e.id === m.id));
        if (deleted.length > 0) {
          NotificationUtil.warning("删除模型：" + deleted.map(e => e.name).join("，") + "，模型删除后，所创建的AI助手也将无法使用，请及时更新。", "uTools模型有更新");
        }
      }
      // 每次都重新赋值
      uToolsModels.value = target;
      // 保存
      await saveListByAsync(LocalNameEnum.AI_U_TOOLS_MODELS, uToolsModels.value, models.rev);
      setItem(LocalNameEnum.KEY_COMPONENT_U_TOOLS_MODEL_UPDATE, now);
    })().catch(e => {
      MessageUtil.error("获取uTools提供模型失败", e);
      // 清空模型
      uToolsModels.value = [];
      // 保存
      saveListByAsync(LocalNameEnum.AI_U_TOOLS_MODELS, uToolsModels.value, models.rev);
    })
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