import {defineStore} from "pinia";
import {AiAssistant} from "@/entity/ai/AiAssistant";
import {listByAsync, saveListByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/lang/ArrayUtil";

export const useAiAssistantStore = defineStore('ai-assistant', () => {
  const aiAssistants = ref<Array<AiAssistant>>([])
  const rev = ref<string>();

  const aiAssistantMap = computed(() => map(aiAssistants.value, 'id'));

  async function init() {
    const res = await listByAsync<AiAssistant>(LocalNameEnum.AI_ASSISTANT);
    aiAssistants.value = res.list;
    rev.value = res.rev;
  }


  async function saveOrUpdate(aiService: AiAssistant) {
    const index = aiAssistants.value.findIndex(e => e.id === aiService.id);
    if (index !== -1) {
      aiAssistants.value[index] = aiService;
    } else {
      aiAssistants.value.push(aiService);
    }
    rev.value = await saveListByAsync(LocalNameEnum.AI_ASSISTANT, aiAssistants.value, rev.value);
  }

  async function remove(id: string) {
    const index = aiAssistants.value.findIndex(e => e.id === id);
    if (index !== -1) {
      aiAssistants.value.splice(index, 1);
      rev.value = await saveListByAsync(LocalNameEnum.AI_ASSISTANT, aiAssistants.value, rev.value);
    }
  }

  return {
    aiAssistants, aiAssistantMap,
    init, saveOrUpdate, remove
  }

});