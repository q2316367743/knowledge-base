<template>
  <div class="ai-service-content  relative overflow-auto">
    <empty-result v-if="!currentId" title="未选择服务" tip="请在左侧选择服务"/>
    <t-layout v-else style="height: calc(100vh - 52px);background-color: var(--td-bg-color-container);">
      <t-content class="overflow-auto" style="height: calc(100% - 18px);padding: 8px;">
        <t-form :model="form">
          <t-form-item label="服务名称" label-align="top">
            <t-input allow-clear v-model="form.name" :disabled="disabled"/>
          </t-form-item>
          <t-form-item label="服务类型" label-align="top" v-if="!disabled">
            <t-radio-group v-model="form.type">
              <t-radio :value="AiServiceType.OPENAI">OpenAI</t-radio>
              <t-radio :value="AiServiceType.OLLAMA">Ollama</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="API 地址" label-align="top" help="注意，OpenAI的地址，结尾要加上/v1/" v-if="!disabled">
            <t-input allow-clear v-model="form.url"/>
          </t-form-item>
          <t-form-item label="API 密钥" label-align="top" v-if="!disabled">
            <t-input type="password" allow-clear v-model="form.key"/>
          </t-form-item>
          <!--      <t-form-item label="模型版本">-->
          <!--        <t-input allow-clear v-model="form.modelVersion" />-->
          <!--      </t-form-item>-->
          <t-form-item label="模型" label-align="top" :help="disabled?'':'上面填写完成后注意刷新模型'">
            <t-list :split="true" style="max-height: calc(100vh - 186px);" class="w-full">
              <t-list-item v-for="(item, index) in form.models" :key="index">
                <div v-if="typeof item === 'string'">{{ item }}</div>
                <t-list-item-meta v-else :image="item.icon" :title="item.label" :description="item.description"/>
                <template #action>
                  <t-tag theme="success" v-if="typeof item !== 'string' && typeof item.cost === 'number'">
                    <span>{{ item.cost }}</span>
                    <span class="ml-4px">能量</span>
                  </t-tag>
                </template>
              </t-list-item>
            </t-list>
          </t-form-item>
        </t-form>
      </t-content>
      <t-footer
        style="padding: 4px 8px;border-top: 1px solid var(--td-border-level-2-color);display: flex;justify-content: space-between"
        v-if="!disabled">
        <t-space>
          <t-button theme="primary" @click="save">保存</t-button>
          <t-popconfirm content="是否立即删除此服务，删除后，此服务创建的 AI 助手将无法使用" @ok="onDelete()">
            <t-button theme="danger" v-if="currentId && currentId !== '0'">删除</t-button>
          </t-popconfirm>
        </t-space>
        <t-space>
          <t-button theme="primary" :loading @click="fetchModules">
            <template #icon>
              <refresh-icon/>
            </template>
            刷新
          </t-button>
          <t-button theme="default" :loading @click="onAdd()">
            <template #icon>
              <plus-icon/>
            </template>
            添加
          </t-button>
        </t-space>
      </t-footer>
    </t-layout>
  </div>
</template>
<script lang="ts" setup>
import {clone} from "radash";
import {PlusIcon, RefreshIcon} from "tdesign-icons-vue-next";
import {useAiServiceStore} from "@/store";
import EmptyResult from "@/components/Result/EmptyResult.vue";
import {AiServiceType, buildAiService} from "@/entity/ai/AiService";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {getAllModules} from "@/utils/component/AiModuleUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {openAddModelDialog} from "@/pages/setting/ai-service/model/AddModel";

const props = defineProps({
  currentId: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['save']);

const form = ref(buildAiService());
const loading = ref(false);

const disabled = computed(() => form.value.type === AiServiceType.U_TOOLS);

watch(() => props.currentId, val => {
  if (val) {
    if (val === '0') {
      form.value = buildAiService();
    } else {
      const {aiServices} = useAiServiceStore();
      for (let aiService of aiServices) {
        if (aiService.id === val) {
          form.value = clone(aiService);
          return;
        }
      }
    }
  }
})

function fetchModules() {
  if (isEmptyString(form.value.url)) return MessageUtil.warning("请输入API 地址");
  if (isEmptyString(form.value.key)) return MessageUtil.warning("请输入API 密钥");
  (async () => {
    loading.value = true;
    try {
      form.value.models = await getAllModules(form.value);
      MessageUtil.success("获取成功");
    } catch (e) {
      MessageUtil.error("获取失败", e);
    } finally {
      loading.value = false;
    }
  })().catch(e => MessageUtil.error("获取失败", e));
}

function save() {
  useAiServiceStore().saveOrUpdate(form.value)
    .then(() => {
      emit('save', form.value.id);
      MessageUtil.success("保存成功")
    })
    .catch(e => MessageUtil.error("保存失败", e));
}

function onDelete() {
  useAiServiceStore().remove(props.currentId).then(() => {
    MessageUtil.success("删除成功");
    emit('save', '');
  })
    .catch(e => MessageUtil.error("删除失败", e));
}

const onAdd = () => openAddModelDialog().then(res => form.value.models.push(res))
</script>
<style scoped lang="less">
</style>
