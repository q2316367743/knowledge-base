<template>
  <div class="ai-service-content  relative overflow-auto">
    <empty-result v-if="!currentId" title="未选择服务" tip="请在左侧选择服务"/>
    <t-layout v-else style="height: calc(100vh - 52px);background-color: var(--td-bg-color-container);">
      <t-content class="overflow-auto" style="height: calc(100% - 18px);padding: 8px;">
        <t-form :model="form">
          <t-form-item label="服务名称" label-align="top">
            <t-input allow-clear v-model="form.name" :disabled="disabled"/>
          </t-form-item>
          <t-form-item label="服务类型" label-align="top">
            <t-radio-group v-model="form.type" :disabled="disabled">
              <t-radio :value="AiServiceType.OPENAI">OpenAI</t-radio>
            </t-radio-group>
          </t-form-item>
          <t-form-item label="API 地址" label-align="top" help="注意，OpenAI的地址，结尾要加上/v1/">
            <t-input allow-clear v-model="form.url" :disabled="disabled"/>
          </t-form-item>
          <t-form-item label="API 密钥" label-align="top">
            <t-input type="password" allow-clear v-model="form.key" :disabled="disabled"/>
          </t-form-item>
          <!--      <t-form-item label="模型版本">-->
          <!--        <t-input allow-clear v-model="form.modelVersion" />-->
          <!--      </t-form-item>-->
          <t-form-item label="模型" label-align="top" help="上面填写完成后注意刷新模型">
            <t-card class="w-full" :header-bordered="true">
              <template #header v-if="!disabled">
                <t-space>
                  <t-button theme="primary" :loading @click="getAllModules">
                    <template #icon>
                      <icon-refresh/>
                    </template>
                    刷新
                  </t-button>
                  <t-button theme="default" :loading>
                    <template #icon>
                      <icon-plus/>
                    </template>
                    添加
                  </t-button>
                </t-space>
              </template>
              <t-list :split="true" class="max-h-350px">
                <t-list-item v-for="(item, index) in form.models" :key="index">
                  {{ item }}
                </t-list-item>
              </t-list>
            </t-card>
          </t-form-item>
        </t-form>
      </t-content>
      <t-footer style="padding: 8px 0;border-top: 1px solid var(--color-border-2)" v-if="!disabled">
        <t-space>
          <t-button theme="primary" @click="save">保存</t-button>
          <t-popconfirm content="是否立即删除此服务，删除后，此服务创建的 AI 助手将无法使用" @ok="onDelete()">
            <t-button theme="danger" v-if="currentId && currentId !== '0'">删除</t-button>
          </t-popconfirm>
        </t-space>
      </t-footer>
    </t-layout>

  </div>
</template>
<script lang="ts" setup>
import OpenAI from "openai";
import {clone} from "radash";
import EmptyResult from "@/components/Result/EmptyResult.vue";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {AiServiceType, buildAiService} from "@/entity/ai/AiService";
import MessageUtil from "@/utils/modal/MessageUtil";
import {isEmptyString} from "@/utils/lang/FieldUtil";


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

function getAllModules() {
  if (isEmptyString(form.value.url)) return MessageUtil.warning("请输入API 地址");
  if (isEmptyString(form.value.key)) return MessageUtil.warning("请输入API 密钥");
  (async () => {
    loading.value = true;
    const openAi = new OpenAI({
      baseURL: form.value.url,
      apiKey: form.value.key,
      dangerouslyAllowBrowser: true
    })
    try {
      const res = await openAi.models.list();
      const items = new Array<string>();
      items.push(...res.data.map(e => e.id));
      while (res.hasNextPage()) {
        await res.getNextPage();
        items.push(...res.data.map(e => e.id));
      }
      form.value.models = items;
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
</script>
<style scoped lang="less">
</style>
