import {defineStore} from "pinia";
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {useAiServiceStore} from "@/store";
import {findModel} from "@/entity/ai/AiService";

export const useAiAssistantStore = defineStore('ai-assistant', () => {
  const list = ref<Array<AiAssistant>>([])
  const rev = ref<string>();

  const aiAssistants = computed<Array<AiAssistant>>(() => {
    const {uToolsModels} = useAiServiceStore();
    return [
      ...uToolsModels.map(e => ({
        id: e.id,
        createBy: 0,
        name: e.label,
        system: '',
        aiServiceId: '1',
        model: e.id,
        temperature: 1,
        topP: 1,
        maxChats: 5,
        default: true,
        description: e.description,
        icon: e.icon
      })),
      ...list.value
    ] as Array<AiAssistant>
  });
  const aiAssistantMap = computed(() => map(aiAssistants.value, 'id'));

  async function init() {
    const res = await listByAsync<AiAssistant>(LocalNameEnum.AI_ASSISTANT);
    list.value = res.list;
    rev.value = res.rev;
  }


  async function saveOrUpdate(form: AiAssistant) {
    if (isEmptyString(form.name)) {
      return Promise.reject("请输入助手名");
    }
    if (isEmptyString(form.aiServiceId)) {
      return Promise.reject("请选择 AI 服务");
    }
    if (isEmptyString(form.model)) {
      return Promise.reject("请选择 AI 模型");
    }
    const {aiServiceMap} = useAiServiceStore();
    const aiService = aiServiceMap.get(form.aiServiceId);
    if (!aiService) {
      return Promise.reject("AI 服务未找到");
    }
    const targetModel = findModel(aiService.models, form.model);
    if (!targetModel) {
      return Promise.reject("AI 模型未找到");
    }
    const index = list.value.findIndex(e => e.id === form.id);
    if (index !== -1) {
      list.value[index] = form;
    } else {
      list.value.push(form);
    }
    console.log(list.value)
    rev.value = await saveListByAsync(LocalNameEnum.AI_ASSISTANT, list.value, rev.value);
  }

  async function remove(id: string) {
    const index = list.value.findIndex(e => e.id === id);
    if (index !== -1) {
      list.value.splice(index, 1);
      rev.value = await saveListByAsync(LocalNameEnum.AI_ASSISTANT, list.value, rev.value);
    }
  }

  return {
    aiAssistants, aiAssistantMap,
    init, saveOrUpdate, remove
  }

});