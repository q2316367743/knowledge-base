<template>
  <div class="ai-service-content  relative overflow-auto">
    <empty-result v-if="!currentId" title="未选择服务" tip="请在左侧选择服务"/>
    <a-layout v-else style="height: calc(100vh - 52px);">
      <a-layout-content class="overflow-auto" style="height: calc(100% - 18px);padding: 0 8px;">
        <a-form :model="form" layout="vertical">
          <a-form-item label="服务名称">
            <a-input allow-clear v-model="form.name"/>
          </a-form-item>
          <a-form-item label="服务类型">
            <a-radio-group v-model="form.type">
              <a-radio :value="AiServiceType.OPENAI">OpenAI</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="API 地址">
            <a-input allow-clear v-model="form.url"/>
          </a-form-item>
          <a-form-item label="API 密钥">
            <a-input-password allow-clear v-model="form.key"/>
          </a-form-item>
          <!--      <a-form-item label="模型版本">-->
          <!--        <a-input allow-clear v-model="form.modelVersion" />-->
          <!--      </a-form-item>-->
          <a-form-item label="模型">
            <a-list class="w-full" max-height="500px">
              <a-list-item v-for="(item, index) in form.models" :key="index">
                {{ item }}
              </a-list-item>
              <template #header>
                <a-space>
                  <a-button type="primary" :loading @click="getAllModules">
                    <template #icon>
                      <icon-refresh/>
                    </template>
                    刷新
                  </a-button>
                  <a-button type="secondary" :loading>
                    <template #icon>
                      <icon-plus/>
                    </template>
                    添加
                  </a-button>
                </a-space>
              </template>
            </a-list>
          </a-form-item>
        </a-form>
      </a-layout-content>
      <a-layout-footer style="padding: 8px 0;border-top: 1px solid var(--color-border-2)">
        <a-space>
          <a-button type="primary" @click="save">保存</a-button>
          <a-popconfirm content="是否立即删除此服务，删除后，此服务创建的 AI 助手将无法使用" @ok="onDelete()">
            <a-button type="primary" status="danger" v-if="currentId && currentId !== '0'">删除</a-button>
          </a-popconfirm>
        </a-space>
      </a-layout-footer>
    </a-layout>

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
